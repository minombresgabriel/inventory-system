require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./config/db");

// Automatización
const fs = require("fs");
const path = require("path");
const xlsx = require("xlsx");
const cron = require("node-cron");

const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cors());
app.use(express.json());

// Obtener la ruta del escritorio del usuario
const desktopPath = path.join(require("os").homedir(), "Desktop");
// Definir la carpeta donde se guardará el archivo
const salesFolderPath = path.join(desktopPath, "RegistroDeVentas");

if (!fs.existsSync(salesFolderPath)) {
  fs.mkdirSync(salesFolderPath, { recursive: true });
}

// Función mejorada para obtener la fecha actual en formato YYYY-MM-DD
function getCurrentDate() {
  const now = new Date();
  // Aseguramos el formato correcto independientemente de la zona horaria
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const generateSalesReport = () => {
  const today = getCurrentDate();
  console.log(`[Reporte Automático] Buscando ventas para: ${today}`);

  const query = `
    SELECT 
      sales.id, 
      products.name AS product_name, 
      sales.quantity, 
      sales.total_price, 
      sales.date 
    FROM sales
    INNER JOIN products ON sales.product_id = products.id
    WHERE DATE(sales.date) = ? OR DATE(CONVERT_TZ(sales.date, '+00:00', @@session.time_zone)) = ?
  `;

  db.query(query, [today, today], (err, results) => {
    if (err) {
      console.error("❌ Error al consultar la base de datos:", err);
      return;
    }

    console.log(`[Reporte Automático] Ventas encontradas: ${results.length}`);
    if (results.length === 0) {
      console.log("⚠️ No hay ventas registradas hoy. No se generará archivo.");
      return;
    }

    // Convertir total_price a números
    const numericResults = results.map((item) => ({
      ...item,
      total_price: Number(item.total_price),
    }));

    const totalSum = numericResults.reduce(
      (sum, sale) => sum + sale.total_price,
      0
    );

    const totalRow = {
      id: "",
      product_name: "TOTAL DEL DÍA",
      quantity: "",
      total_price: Number(totalSum.toFixed(2)),
      date: "",
    };

    const dataWithTotal = [...numericResults, totalRow];

    // Generar el archivo Excel
    const ws = xlsx.utils.json_to_sheet(dataWithTotal);
    const wb = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, "Ventas");

    const filePath = path.join(salesFolderPath, `ventas_${today}.xlsx`);
    xlsx.writeFile(wb, filePath);

    console.log("✅ Reporte de ventas generado automáticamente:", filePath);
  });
};

// Programar la tarea automática a las 22:00 todos los días
cron.schedule("0 22 * * *", () => {
  console.log("⏳ Generando reporte de ventas automático...");
  generateSalesReport();
});

// Ruta para exportar solo las ventas del día actual a Excel con total
app.get("/export-sales", (req, res) => {
  try {
    const today = getCurrentDate();
    console.log(`[Export Manual] Buscando ventas para: ${today}`);

    const query = `
      SELECT 
        products.name AS Nombre, 
        sales.quantity AS Cantidad, 
        sales.total_price AS Total, 
        sales.date AS Fecha 
      FROM sales
      INNER JOIN products ON sales.product_id = products.id
      WHERE DATE(sales.date) = ? OR DATE(CONVERT_TZ(sales.date, '+00:00', @@session.time_zone)) = ?
      ORDER BY sales.date DESC
    `;

    db.query(query, [today, today], (err, results) => {
      if (err) {
        console.error("Error al consultar la base de datos:", err);
        return res.status(500).send("Hubo un error al obtener las ventas.");
      }

      console.log(`[Export Manual] Ventas encontradas: ${results.length}`);
      if (results.length === 0) {
        console.log("⚠️ No hay ventas registradas hoy.");
        const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.json_to_sheet([
          { Mensaje: "No hay ventas registradas para hoy." },
        ]);
        xlsx.utils.book_append_sheet(wb, ws, "Ventas de Hoy");
        const excelBuffer = xlsx.write(wb, {
          type: "buffer",
          bookType: "xlsx",
        });

        res.setHeader(
          "Content-Disposition",
          `attachment; filename=ventas_${today}.xlsx`
        );
        res.setHeader(
          "Content-Type",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        return res.send(excelBuffer);
      }

      // 1. Convertir los Total a números y calcular suma
      const numericResults = results.map((item) => ({
        ...item,
        Total: Number(item.Total), // Asegurar que es número
      }));

      const totalSum = numericResults.reduce(
        (sum, sale) => sum + sale.Total,
        0
      );

      // 2. Crear fila de total
      const totalRow = {
        Nombre: "TOTAL DEL DÍA",
        Cantidad: "",
        Total: Number(totalSum.toFixed(2)), // Convertir a número después del toFixed
        Fecha: "",
      };

      // 3. Formatear datos para Excel
      const excelData = numericResults.map((item) => ({
        ...item,
        Total: Number(item.Total.toFixed(2)), // Formatear a 2 decimales
        Fecha: new Date(item.Fecha).toLocaleString(),
      }));

      // 4. Agregar el total al final
      excelData.push(totalRow);

      // Resto del código para generar Excel...
      const ws = xlsx.utils.json_to_sheet(excelData);
      const wb = xlsx.utils.book_new();
      xlsx.utils.book_append_sheet(wb, ws, "Ventas de Hoy");

      const excelBuffer = xlsx.write(wb, { type: "buffer", bookType: "xlsx" });

      res.setHeader(
        "Content-Disposition",
        `attachment; filename=ventas_${today}.xlsx`
      );
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.send(excelBuffer);
    });
  } catch (error) {
    console.error("Error al exportar ventas a Excel:", error);
    res.status(500).send("Hubo un error al exportar las ventas.");
  }
});

// Endpoint para probar conexión
app.get("/test-db", (req, res) => {
  db.query("SELECT 1 + 1 AS result", (err, results) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Error connecting to the database" });
    }
    res.json({ message: "Database connected!", result: results[0].result });
  });
});

app.get("/", (req, res) => {
  res.send("API is running!");
});

const productRoutes = require("./routes/productRoutes");
app.use("/api/products", productRoutes);

const salesRoutes = require("./routes/sales");
app.use("/api/sales", salesRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

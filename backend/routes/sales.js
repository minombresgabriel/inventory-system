const express = require("express");
const db = require("../config/db");
const router = express.Router();

// Obtener el total de ganancias para una fecha específica
router.get("/total", (req, res) => {
  const { date } = req.query; // Obtener la fecha desde el query parameter

  // Si no se proporciona una fecha, usar la fecha actual
  const targetDate = date
    ? new Date(date).toISOString().split("T")[0]
    : new Date().toISOString().split("T")[0];

  const query = `
    SELECT SUM(total_price) AS totalEarnings
    FROM sales
    WHERE DATE(date) = ?;
  `;

  db.query(query, [targetDate], (err, results) => {
    if (err) {
      console.error("Error fetching total earnings:", err);
      return res
        .status(500)
        .json({ message: "Error al obtener las ganancias" });
    }

    const totalEarnings = results[0].totalEarnings || 0; // Si no hay ventas, el total es 0
    res.json({ totalEarnings });
  });
});

// Obtener el historial de ventas para una fecha específica
router.get("/", (req, res) => {
  const { date } = req.query; // Obtener la fecha desde el query parameter

  // Si no se proporciona una fecha, usar la fecha actual
  const targetDate = date
    ? new Date(date).toISOString().split("T")[0]
    : new Date().toISOString().split("T")[0];

  const query = `
    SELECT sales.id, products.name AS productName, sales.quantity, sales.total_price, sales.date
    FROM sales
    JOIN products ON sales.product_id = products.id
    WHERE DATE(sales.date) = ?  -- Filtrar por la fecha proporcionada
    ORDER BY sales.date DESC;
  `;

  db.query(query, [targetDate], (err, results) => {
    if (err) {
      console.error("Error fetching sales history:", err);
      return res
        .status(500)
        .json({ message: "Error al obtener el historial de ventas" });
    }
    res.json(results);
  });
});

// Registrar una venta
router.post("/", (req, res) => {
  const { productId, quantity, totalPrice } = req.body;

  const insertSaleQuery = `
    INSERT INTO sales (product_id, quantity, total_price) 
    VALUES (?, ?, ?);
  `;
  const updateProductQuery = `
    UPDATE products 
    SET quantity = quantity - ? 
    WHERE id = ?;
  `;

  // Registrar la venta en la tabla 'sales'
  db.query(
    insertSaleQuery,
    [productId, quantity, totalPrice],
    (err, result) => {
      if (err) {
        console.error("Error registering sale:", err);
        return res.status(500).json({ message: "Error al registrar la venta" });
      }

      // Actualizar la cantidad del producto en la tabla 'products'
      db.query(updateProductQuery, [quantity, productId], (err) => {
        if (err) {
          console.error("Error updating product quantity:", err);
          return res.status(500).json({
            message:
              "Venta registrada, pero no se pudo actualizar el inventario",
          });
        }

        res.status(201).json({
          message: "Venta registrada y cantidad actualizada",
          saleId: result.insertId,
        });
      });
    }
  );
});

// Eliminar una venta
router.delete("/:id", (req, res) => {
  const saleId = req.params.id;

  // Consultar los detalles de la venta para revertir los cambios en el inventario
  const getSaleQuery = `
    SELECT product_id, quantity 
    FROM sales 
    WHERE id = ?;
  `;
  const deleteSaleQuery = `
    DELETE FROM sales 
    WHERE id = ?;
  `;
  const updateProductQuery = `
    UPDATE products 
    SET quantity = quantity + ? 
    WHERE id = ?;
  `;

  // Obtener los detalles de la venta
  db.query(getSaleQuery, [saleId], (err, results) => {
    if (err) {
      console.error("Error fetching sale details:", err);
      return res
        .status(500)
        .json({ message: "Error al obtener los detalles de la venta" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Venta no encontrada" });
    }

    const { product_id, quantity } = results[0];

    // Eliminar la venta
    db.query(deleteSaleQuery, [saleId], (err) => {
      if (err) {
        console.error("Error deleting sale:", err);
        return res.status(500).json({ message: "Error al eliminar la venta" });
      }

      // Revertir la cantidad del producto
      db.query(updateProductQuery, [quantity, product_id], (err) => {
        if (err) {
          console.error("Error updating product quantity:", err);
          return res.status(500).json({
            message:
              "Venta eliminada, pero no se pudo actualizar el inventario",
          });
        }

        res.json({
          message:
            "Venta eliminada correctamente y cantidad de inventario actualizada",
        });
      });
    });
  });
});

module.exports = router;

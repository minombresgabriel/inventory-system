import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const DailySalesChart = ({ sales }) => {
  // Procesar los datos para el gráfico
  const processChartData = () => {
    // Agrupar ventas por producto
    const salesByProduct = {};

    sales.forEach((sale) => {
      const productName = sale.productName;
      if (productName) {
        if (!salesByProduct[productName]) {
          salesByProduct[productName] = 0;
        }
        salesByProduct[productName] += sale.quantity;
      }
    });

    const productNames = Object.keys(salesByProduct);
    const quantities = Object.values(salesByProduct);

    return {
      labels: productNames,
      datasets: [
        {
          label: "Cantidad vendida",
          data: quantities,
          backgroundColor: "#d97f30",
          borderColor: "#d96f32",
          borderWidth: 1,
        },
      ],
    };
  };

  const chartData = processChartData();

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Esto es clave para el ajuste de altura
    plugins: {
      legend: {
        display: false, // Ocultamos la leyenda para ahorrar espacio
      },
      title: {
        display: true,
        text: "Ventas por producto (hoy)",
        font: {
          size: 16,
          weight: "bold",
        },
        padding: {
          top: 10,
          bottom: 20,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Cantidad vendida",
          font: {
            weight: "bold",
          },
        },
        ticks: {
          stepSize: 20, // Esto crea intervalos de 20 en 20 como en tu imagen
          precision: 0, // Para evitar decimales
        },
        grid: {
          color: "rgba(166, 125, 101, 0.1)", // Color de la cuadrícula
        },
      },
      x: {
        title: {
          display: true,
          text: "Productos",
          font: {
            weight: "bold",
          },
        },
        grid: {
          color: "rgba(166, 125, 101, 0.3)", // Color de la cuadrícula
        },
      },
    },
    layout: {
      padding: {
        top: 10,
        right: 10,
        bottom: 10,
        left: 10,
      },
    },
  };

  return (
    <div className="chart-card">
      <div className="chart-wrapper">
        {sales.length > 0 ? (
          <Bar
            data={chartData}
            options={options}
            height={null} // Importante para el responsive
            width={null}
          />
        ) : (
          <p className="no-data-message">No hay datos de ventas para mostrar</p>
        )}
      </div>
    </div>
  );
};

export default DailySalesChart;

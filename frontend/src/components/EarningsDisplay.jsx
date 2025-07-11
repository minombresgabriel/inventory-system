import React from "react";
import "./EarningsDisplay.css"; // Asegúrate de crear este archivo CSS para estilos

const EarningsDisplay = ({ totalEarnings, dollarRate, loading, error }) => {
  return (
    <div className="earnings-display">
      <h2>Bolivares: {Number(totalEarnings).toFixed(2)} Bs</h2>
      <h2>
        Dólares:{" "}
        {loading ? (
          "Cargando..."
        ) : error ? (
          <span style={{ color: "red" }}>{error}</span>
        ) : (
          `$${(Number(totalEarnings) / dollarRate).toFixed(2)}`
        )}
      </h2>
    </div>
  );
};

export default EarningsDisplay;

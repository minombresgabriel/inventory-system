import React, { useState } from "react";
import "./ChangeDollarRateModal.css";

const ChangeDollarRateModal = ({ isOpen, onClose, onUpdateDollarRate }) => {
  const [newDollarRate, setNewDollarRate] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Reemplazar comas por puntos para manejar ambos formatos
    const formattedValue = newDollarRate.replace(",", ".");
    const rate = parseFloat(formattedValue);
    if (!isNaN(rate) && rate > 0) {
      onUpdateDollarRate(rate); // Llama a la función para actualizar el valor del dólar
      onClose(); // Cierra el modal
    } else {
      alert(
        "Por favor, ingresa un valor válido para el dólar (ejemplo: 60.24 o 60,24)."
      );
    }
  };

  if (!isOpen) return null; // No renderizar el modal si no está abierto

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Cambiar Valor del Dólar</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text" // Cambiado a "text" para permitir comas y puntos
            value={newDollarRate}
            onChange={(e) => setNewDollarRate(e.target.value)}
            placeholder="Nuevo valor del dólar"
          />
          <button type="submit">Actualizar</button>
          <button type="button" onClick={onClose}>
            Cancelar
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangeDollarRateModal;

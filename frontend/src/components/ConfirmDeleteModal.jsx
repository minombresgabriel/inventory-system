import React from "react";

const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>¿Eliminar venta?</h2>
        <p>¿Estás seguro de que deseas eliminar esta venta?</p>
        <div className="modal-actions">
          <button onClick={onConfirm} className="delete-button">
            Sí, eliminar
          </button>
          <button onClick={onClose} className="cancel-button">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;

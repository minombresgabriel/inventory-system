import React from "react";
import "./ToggleProductsModal.css";
import api from "../services/api"; // Asegúrate de tener configurado axios

const ToggleProductsModal = ({ isOpen, onClose, products, setProducts }) => {
  if (!isOpen) return null;

  const handleToggleActive = async (id, currentState) => {
    try {
      const newState = !currentState;
      await api.put(`/products/toggle/${id}`, { isActive: newState });

      // Actualizar estado localmente
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === id ? { ...product, isActive: newState } : product
        )
      );
    } catch (error) {
      console.error("Error al cambiar estado del producto:", error);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Activar/Desactivar Productos</h2>
        <button className="close-button" onClick={onClose}>
          X
        </button>

        <div className="product-list-modal">
          {products.map((product) => (
            <div key={product.id} className="product-item-modal">
              <h3>{product.name}</h3>

              {/* 🔹 Switch para activar/desactivar */}
              <label className="switch">
                <input
                  type="checkbox"
                  checked={product.isActive}
                  onChange={() =>
                    handleToggleActive(product.id, product.isActive)
                  }
                />
                <span className="slider round"></span>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ToggleProductsModal;

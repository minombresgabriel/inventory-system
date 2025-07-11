import React, { useState } from "react";
import "./SellModal.css"; // Asegúrate de tener un archivo CSS para el modal.

const SellModal = ({ isOpen, onClose, onSellProduct, product }) => {
  const [quantity, setQuantity] = useState(1); // Valor por defecto de la cantidad

  const handleSellClick = () => {
    if (quantity > 0 && quantity <= product.quantity) {
      const totalPrice = product.price * quantity;
      onSellProduct(product.id, quantity, totalPrice); // Vender producto
      onClose(); // Cerrar el modal después de la venta
    } else {
      alert("Cantidad inválida.");
    }
  };

  if (!isOpen) return null; // Si el modal no está abierto, no renderiza nada

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Vender Producto: {product.name}</h2>
        <p>Precio: Bs {product.price}</p>
        <p>Disponibilidad: {product.quantity} unidades</p>

        <label htmlFor="quantity">Cantidad a vender:</label>
        <input
          type="number"
          id="quantity"
          value={quantity}
          min="1"
          max={product.quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value))}
        />
        <div className="modal-actions">
          <button onClick={handleSellClick}>Vender</button>
          <button onClick={onClose}>Cerrar</button>
        </div>
      </div>
    </div>
  );
};

export default SellModal;

import React, { useState } from "react";

const AddSaleModal = ({ onClose, onAddSale }) => {
  const [productName, setProductName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [totalPrice, setTotalPrice] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!productName || !quantity || !totalPrice) {
      alert("Por favor completa todos los campos.");
      return;
    }

    const newSale = {
      productName,
      quantity: parseInt(quantity),
      totalPrice: parseFloat(totalPrice),
    };

    onAddSale(newSale);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Agregar Venta</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Nombre del Producto:</label>
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Cantidad:</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Precio Total:</label>
            <input
              type="number"
              step="0.01"
              value={totalPrice}
              onChange={(e) => setTotalPrice(e.target.value)}
              required
            />
          </div>
          <div className="modal-actions">
            <button type="submit" className="btn btn-primary">
              Agregar Venta
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSaleModal;

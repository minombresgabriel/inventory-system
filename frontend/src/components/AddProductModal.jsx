import React, { useState } from "react";
import "./AddProductModal.css";

const AddProductModal = ({ onClose, onAddProduct }) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !price || !quantity) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    // Validar que el precio sea un número válido
    const priceValue = parseFloat(price.replace(",", ".")); // Acepta comas y puntos
    if (isNaN(priceValue)) {
      alert("Por favor, ingresa un precio válido.");
      return;
    }

    // Enviar los datos al padre
    onAddProduct({
      name,
      price: priceValue,
      quantity: parseInt(quantity, 10),
    });
    onClose(); // Cerrar el modal después de agregar el producto
  };

  const handlePriceChange = (e) => {
    let value = e.target.value;

    // Permitir solo números y un punto decimal
    value = value.replace(/[^0-9.]/g, "");

    // Asegurarse de que solo haya un punto decimal
    const parts = value.split(".");
    if (parts.length > 2) {
      value = parts[0] + "." + parts.slice(1).join("");
    }

    // Limitar la parte entera a 3 dígitos
    const integerPart = parts[0];
    if (integerPart.length > 3) {
      value = integerPart.slice(0, 3) + (parts[1] ? `.${parts[1]}` : "");
    }

    setPrice(value);
  };

  const handleQuantityChange = (e) => {
    let value = e.target.value.replace(/\D/g, ""); // Elimina caracteres no numéricos
    value = Math.max(0, Number(value)).toString().slice(0, 3); // Máximo 3 dígitos
    setQuantity(value);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Agregar Nuevo Producto</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Nombre del Producto:</label>
            <input
              maxLength={17}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label>Precio:</label>
            <input
              type="text" // Cambiado a "text" para permitir decimales
              value={price}
              onChange={handlePriceChange}
              placeholder="Ejemplo: 60.24"
            />
          </div>
          <div>
            <label>Cantidad:</label>
            <input
              type="number"
              value={quantity}
              onChange={handleQuantityChange}
              placeholder="Máx. 999"
            />
          </div>
          <div className="modal-buttons">
            <button type="submit">Agregar Producto</button>
            <button type="button" onClick={onClose}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;

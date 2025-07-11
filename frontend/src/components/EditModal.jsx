import React, { useState, useEffect } from "react";
import "./EditModal.css";

const EditModal = ({ isOpen, onClose, onEditProduct, product }) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");

  // Este efecto se dispara cuando el producto cambia
  useEffect(() => {
    if (product) {
      setName(product.name);
      setPrice(product.price.toString()); // Convertimos a string para evitar problemas en el input
      setQuantity(product.quantity.toString());
    }
  }, [product]);

  const handleSave = () => {
    if (name && price > 0 && quantity >= 0) {
      // Validar que el precio sea un número válido
      const priceValue = parseFloat(price.replace(",", ".")); // Acepta comas y puntos
      if (isNaN(priceValue)) {
        alert("Por favor, ingresa un precio válido.");
        return;
      }

      const updatedProduct = {
        id: product.id,
        name,
        price: priceValue,
        quantity: parseInt(quantity, 10),
        isActive: product.isActive, // Mantiene el estado actual de activación
      };
      onEditProduct(updatedProduct);
      onClose();
    } else {
      alert("Por favor, completa todos los campos correctamente.");
    }
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

  if (!isOpen) return null; // No renderizar si el modal no está abierto

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Editar Producto</h2>
        <label htmlFor="name">Nombre</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={17} // Limitar el nombre a 17 caracteres
        />
        <label htmlFor="price">Precio</label>
        <input
          type="text" // Cambiado a "text" para permitir decimales
          id="price"
          value={price}
          onChange={handlePriceChange}
          placeholder="Ejemplo: 60.24"
        />
        <label htmlFor="quantity">Cantidad</label>
        <input
          type="number"
          id="quantity"
          value={quantity}
          onChange={handleQuantityChange}
          placeholder="Máx. 999"
        />
        <div className="modal-actions">
          <button onClick={handleSave}>Guardar Cambios</button>
          <button onClick={onClose}>Cerrar</button>
        </div>
      </div>
    </div>
  );
};

export default EditModal;

import { useState } from "react";
import api from "../services/api";

const EditProductForm = ({ product, onClose, onUpdate }) => {
  const [name, setName] = useState(product.name);
  const [price, setPrice] = useState(product.price);
  const [quantity, setQuantity] = useState(product.quantity);

  const handleSubmit = (e) => {
    e.preventDefault();
    api
      .put(`/products/${product.id}`, { name, price, quantity })
      .then(() => {
        onUpdate(); // Llamar para refrescar la lista de productos
        onClose(); // Cerrar el formulario
      })
      .catch((error) => console.error("Error updating product:", error));
  };

  return (
    <div className="edit-product-form">
      <h2>Editar Productosss</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Nombre:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <label>
          Precio:
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </label>
        <label>
          Cantidad:
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </label>
        <button type="submit">Guardar Cambios</button>
        <button type="button" onClick={onClose}>
          Cancelar
        </button>
      </form>
    </div>
  );
};

export default EditProductForm;

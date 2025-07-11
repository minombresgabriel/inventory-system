import React, { useState } from "react";
import "./DeleteProductModal.css"; // Importamos los estilos

const DeleteProductModal = ({ products, onDeleteProduct, onClose }) => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleRowClick = (product) => {
    setSelectedProduct(product);
    setIsConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (selectedProduct) {
      onDeleteProduct(selectedProduct.id);
      setIsConfirmOpen(false);
      setSelectedProduct(null);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2 className="modal-title">Eliminar Producto</h2>
        <table className="product-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Cantidad</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr
                key={product.id}
                onClick={() => handleRowClick(product)}
                className="table-row"
              >
                <td>{product.name}</td>
                <td>Bs {product.price}</td>
                <td>{product.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <button className="close-button" onClick={onClose}>
          Cerrar
        </button>

        {/* Modal de Confirmación */}
        {isConfirmOpen && (
          <div className="confirm-modal">
            <p>¿Seguro que quieres eliminar "{selectedProduct.name}"?</p>
            <button className="delete-button" onClick={confirmDelete}>
              Sí, eliminar
            </button>
            <button
              className="cancel-button"
              onClick={() => setIsConfirmOpen(false)}
            >
              Cancelar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeleteProductModal;

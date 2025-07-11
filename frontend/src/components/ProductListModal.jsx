import React, { useState } from "react";
import EditModal from "./EditModal";
import "./ProductListModal.css";

const ProductListModal = ({ products, onEditProduct, onClose }) => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleRowClick = (product) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Lista de Productos</h2>
        <div className="table-container">
          {" "}
          {/* Contenedor scrolleable */}
          <table>
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
                  style={{ cursor: "pointer" }}
                >
                  <td>{product.name}</td>
                  <td>Bs {product.price}</td>
                  <td>{product.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button className="cerrarButton" onClick={onClose}>
          Cerrar
        </button>

        {/* Modal de Edición */}
        {isEditModalOpen && selectedProduct && (
          <EditModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            onEditProduct={onEditProduct}
            product={selectedProduct}
          />
        )}
      </div>
    </div>
  );
};

export default ProductListModal;

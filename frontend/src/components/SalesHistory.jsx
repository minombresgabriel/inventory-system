import React, { useState } from "react";
import "./SalesHistory.css";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

const SalesHistory = ({ sales, onDeleteSale, selectedDate }) => {
  const [selectedSaleId, setSelectedSaleId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = (saleId) => {
    setSelectedSaleId(saleId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSaleId(null);
  };

  const handleConfirmDelete = () => {
    if (selectedSaleId) {
      onDeleteSale(selectedSaleId);
    }
    handleCloseModal();
  };

  return (
    <div className="sales-history">
      {/* Contenedor con scroll */}
      <div className="sales-scroll-container">
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Cantidad</th>
              <th>Precio </th>
              <th>Fecha</th>
              <th>-</th>
            </tr>
          </thead>
          <tbody>
            {sales.length > 0 ? (
              sales.map((sale) => (
                <tr key={sale.id}>
                  <td>{sale.productName}</td>
                  <td>{sale.quantity}</td>
                  <td>Bs {parseFloat(sale.total_price).toFixed(2)}</td>
                  <td>{new Date(sale.date).toLocaleString()}</td>
                  <td>
                    <button
                      onClick={() => handleOpenModal(sale.id)}
                      className="delete-sale-button"
                    >
                      X
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No hay ventas registradas para este día.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <ConfirmDeleteModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default SalesHistory;

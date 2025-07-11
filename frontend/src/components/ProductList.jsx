import React, { useState } from "react";
import "./ProductList.css";
import SellModal from "./SellModal";
import ProductCard from "./ProductCard"; // Importamos el componente

const ProductList = ({ products, onSellProduct }) => {
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleSellClick = (product) => {
    setSelectedProduct(product);
    setIsSellModalOpen(true);
  };

  const handleCloseSellModal = () => {
    setIsSellModalOpen(false);
    setSelectedProduct(null);
  };

  // 🔹 Filtrar productos activos antes de mostrarlos
  const activeProducts = products.filter((product) => product.isActive);

  return (
    <div className="product-list">
      <div className="product-grid">
        {activeProducts.length > 0 ? (
          activeProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSellClick={handleSellClick} // Ahora el clic se maneja en ProductCard
            />
          ))
        ) : (
          <p>No hay productos disponibles</p>
        )}
      </div>

      {/* Modal de venta */}
      {selectedProduct && isSellModalOpen && (
        <SellModal
          isOpen={isSellModalOpen}
          onClose={handleCloseSellModal}
          onSellProduct={onSellProduct}
          product={selectedProduct}
        />
      )}
    </div>
  );
};

export default ProductList;

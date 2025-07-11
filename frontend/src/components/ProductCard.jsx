import React from "react";
import "./ProductCard.css";

const ProductCard = ({ product, onSellClick }) => {
  const handleClick = () => {
    if (product.quantity > 0) {
      onSellClick(product);
    }
  };

  return (
    <div
      className={`product-card ${product.quantity === 0 ? "disabled" : ""}`}
      onClick={handleClick}
    >
      <h3>{product.name}</h3>
      <p>Bs {product.price}</p>
      <span className="quantity-badge">{product.quantity}</span>
    </div>
  );
};

export default ProductCard;

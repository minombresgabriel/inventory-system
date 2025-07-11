import React, { useState, useEffect } from "react";
import ProductList from "./components/ProductList";
import SalesHistory from "./components/SalesHistory";
import AddProductModal from "./components/AddProductModal";
import ProductListModal from "./components/ProductListModal";
import DeleteProductModal from "./components/DeleteProductModal";
import ToggleProductsModal from "./components/ToggleProductsModal";
import EarningsDisplay from "./components/EarningsDisplay";
import DatePickerEarnings from "./components/DatePickerEarnings";
import ChangeDollarRateModal from "./components/ChangeDollarRateModal";
import DailySalesChart from "./components/DailySalesChart";

import api from "./services/api";
import "./App.css";

const App = () => {
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [showProductListModal, setShowProductListModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [dollarRate, setDollarRate] = useState(() => {
    const savedRate = localStorage.getItem("dollarRate");
    return savedRate ? parseFloat(savedRate) : 1.0;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isToggleModalOpen, setIsToggleModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDollarRateModal, setShowDollarRateModal] = useState(false);

  const handleUpdateDollarRate = (newRate) => {
    setDollarRate(newRate);
    localStorage.setItem("dollarRate", newRate);
  };

  const loadProducts = async () => {
    try {
      const response = await api.get("/products");
      setProducts(response.data);
    } catch (error) {
      console.error("Error al cargar los productos:", error);
    }
  };

  const getLocalDateString = (date) => {
    const localDate = new Date(date);
    localDate.setMinutes(
      localDate.getMinutes() - localDate.getTimezoneOffset()
    );
    return localDate.toISOString().split("T")[0];
  };

  const loadSales = async (date = new Date()) => {
    try {
      const formattedDate = getLocalDateString(date);
      const response = await api.get("/sales", {
        params: { date: formattedDate },
      });
      setSales(response.data);
    } catch (error) {
      console.error("Error al cargar las ventas:", error);
    }
  };

  const fetchTotalEarnings = async (date = new Date()) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/sales/total?date=${getLocalDateString(date)}`
      );
      const data = await response.json();
      setTotalEarnings(data.totalEarnings || 0);
    } catch (error) {
      console.error("Error al obtener las ganancias del día:", error);
    }
  };

  useEffect(() => {
    loadProducts();
    loadSales(selectedDate);
    fetchTotalEarnings(selectedDate);
  }, [selectedDate]);

  const handleSellProduct = async (productId, quantity, totalPrice) => {
    try {
      const response = await api.post("/sales", {
        productId,
        quantity,
        totalPrice,
      });

      setSales((prevSales) => [...prevSales, response.data]);

      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === productId
            ? { ...product, quantity: product.quantity - quantity }
            : product
        )
      );
      loadSales();
      fetchTotalEarnings(selectedDate);
    } catch (error) {
      console.error("Error al registrar la venta:", error);
      alert("Hubo un problema al realizar la venta.");
    }
  };

  const handleEditProduct = async (updatedProduct) => {
    if (!updatedProduct || !updatedProduct.id) {
      alert("Error: Producto no válido");
      return;
    }

    try {
      await api.put(`/products/${updatedProduct.id}`, updatedProduct);
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === updatedProduct.id ? updatedProduct : product
        )
      );
    } catch (error) {
      console.error("Error al actualizar el producto:", error);
      alert("Hubo un problema al actualizar el producto.");
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await api.delete(`/products/${productId}`);
      setProducts((prevProducts) =>
        prevProducts.filter((p) => p.id !== productId)
      );
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
      alert("Ocurrió un error al eliminar el producto.");
    }
  };

  const handleDeleteSale = async (saleId) => {
    try {
      const saleToDelete = sales.find((sale) => sale.id === saleId);
      if (!saleToDelete) {
        throw new Error("Venta no encontrada");
      }

      await api.delete(`/sales/${saleId}`);
      setSales((prevSales) => prevSales.filter((sale) => sale.id !== saleId));

      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === saleToDelete.product_id
            ? { ...product, quantity: product.quantity + saleToDelete.quantity }
            : product
        )
      );

      fetchTotalEarnings(selectedDate);
      await loadProducts();
    } catch (error) {
      console.error("Error al eliminar la venta:", error);
      alert("Hubo un problema al eliminar la venta.");
    }
  };

  const handleAddProduct = async (newProduct) => {
    try {
      const response = await api.post("/products", newProduct);
      setProducts((prevProducts) => [...prevProducts, response.data]);
      loadProducts();
    } catch (error) {
      console.error("Error al agregar el producto:", error);
      alert("Hubo un problema al agregar el producto.");
    }
  };

  const handleDownloadExcel = () => {
    fetch("http://localhost:5000/export-sales")
      .then((response) => response.blob())
      .then((blob) => {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "ventas.xlsx";
        link.click();
      })
      .catch((error) => {
        console.error("Error al descargar el archivo Excel:", error);
      });
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    fetchTotalEarnings(date);
  };

  console.log("Datos de ventas:", sales);
  console.log("Datos de productos:", products);

  return (
    <div className="app-layout">
      {/* Menú vertical - Se mantiene igual */}
      <aside className="sidebar">
        <h1 className="app-title">Ananda Shop</h1>

        <div className="sidebar-section">
          <h3>Productos</h3>
          <button className="sidebar-btn" onClick={() => setShowModal(true)}>
            Agregar Producto
          </button>
          <button
            className="sidebar-btn"
            onClick={() => setShowProductListModal(true)}
          >
            Editar Producto
          </button>

          <button
            className="sidebar-btn"
            onClick={() => setIsToggleModalOpen(true)}
          >
            Activar/Desactivar
          </button>
        </div>

        <div className="sidebar-section">
          <h3>Ventas</h3>
          <button className="sidebar-btn" onClick={handleDownloadExcel}>
            Exportar a Excel
          </button>
        </div>

        <div className="sidebar-section">
          <h3>Configuración</h3>
          <button
            className="sidebar-btn"
            onClick={() => setShowDollarRateModal(true)}
          >
            Cambiar Valor del Dólar
          </button>
        </div>

        <div className="date-earnings-sidebar">
          <DatePickerEarnings onDateChange={handleDateChange} />
          <EarningsDisplay
            totalEarnings={totalEarnings}
            dollarRate={dollarRate}
            loading={loading}
            error={error}
          />
        </div>
      </aside>

      {/* Contenido principal reorganizado en tres columnas */}
      <main className="main-content">
        {/* Columna central - Lista de productos con scroll */}
        <div className="product-column">
          <div className="product-list-container">
            <ProductList
              products={products}
              onSellProduct={handleSellProduct}
              onEditProduct={handleEditProduct}
              onDeleteProduct={handleDeleteProduct}
            />
          </div>
        </div>

        {/* Columna derecha - Gráfico e Historial */}
        <div className="right-column">
          <div className="chart-history-container">
            <SalesHistory
              sales={sales}
              onDeleteSale={handleDeleteSale}
              selectedDate={selectedDate}
            />
            <DailySalesChart sales={sales} />
          </div>
        </div>
      </main>

      {/* Modales (se mantienen igual) */}
      {showModal && (
        <AddProductModal
          onClose={() => setShowModal(false)}
          onAddProduct={handleAddProduct}
        />
      )}

      {showProductListModal && (
        <ProductListModal
          products={products}
          onEditProduct={handleEditProduct}
          onClose={() => setShowProductListModal(false)}
        />
      )}

      {showDeleteModal && (
        <DeleteProductModal
          products={products}
          onDeleteProduct={handleDeleteProduct}
          onClose={() => setShowDeleteModal(false)}
        />
      )}

      {isToggleModalOpen && (
        <ToggleProductsModal
          isOpen={isToggleModalOpen}
          onClose={() => setIsToggleModalOpen(false)}
          products={products}
          setProducts={setProducts}
        />
      )}

      {showDollarRateModal && (
        <ChangeDollarRateModal
          isOpen={showDollarRateModal}
          onClose={() => setShowDollarRateModal(false)}
          onUpdateDollarRate={handleUpdateDollarRate}
        />
      )}
    </div>
  );
};

export default App;

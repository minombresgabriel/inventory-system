const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

// Ruta para activar/desactivar un producto
router.put("/toggle/:id", (req, res) => {
  const { id } = req.params;
  const { isActive } = req.body;

  Product.toggleActive(id, isActive, (err, result) => {
    if (err) {
      console.error("Error al cambiar estado del producto:", err);
      res.status(500).json({ error: "Error en el servidor" });
    } else {
      res.json({ message: "Estado actualizado correctamente" });
    }
  });
});

// Obtener todos los productos
router.get("/", (req, res) => {
  Product.getAll((err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Crear un nuevo producto
router.post("/", (req, res) => {
  const { name, image, price, quantity } = req.body;
  Product.create({ name, image, price, quantity }, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: "Product created!", id: results.insertId });
  });
});

// Actualizar un producto
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { name, image, price, quantity } = req.body;
  Product.update(id, { name, image, price, quantity }, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Product updated!" });
  });
});

// Eliminar un producto
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  Product.delete(id, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Product deleted!" });
  });
});

module.exports = router;

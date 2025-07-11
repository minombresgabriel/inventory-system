const db = require("../config/db");

const Product = {
  getAll: (callback) => {
    db.query("SELECT * FROM Products", callback);
  },
  create: (data, callback) => {
    const query =
      "INSERT INTO Products (name, image, price, quantity, isActive) VALUES (?, ?, ?, ?, ?)";
    db.query(
      query,
      [data.name, data.image, data.price, data.quantity, true],
      callback
    ); // Por defecto, activo
  },
  update: (id, data, callback) => {
    const query =
      "UPDATE Products SET name = ?, image = ?, price = ?, quantity = ? WHERE id = ?";
    db.query(
      query,
      [data.name, data.image, data.price, data.quantity, id],
      callback
    );
  },
  toggleActive: (id, isActive, callback) => {
    const query = "UPDATE Products SET isActive = ? WHERE id = ?";
    db.query(query, [isActive, id], callback);
  },
  delete: (id, callback) => {
    const query = "DELETE FROM Products WHERE id = ?";
    db.query(query, [id], callback);
  },
};

module.exports = Product;

# 🛍️ Ananda Shop - Sistema de Inventario y Ventas

**Ananda Shop** es una aplicación web completa desarrollada con **React + Vite** para el frontend y **Node.js + Express + MySQL** para el backend. Está diseñada para gestionar el inventario, ventas y usuarios de manera eficiente para negocios pequeños y medianos.

---

## 🚀 Características Principales

- 📦 Gestión de productos (CRUD)
- 🧾 Registro de ventas con cálculo de totales
- 👥 Gestión de usuarios
- 📊 Dashboard con métricas clave
- 🔐 Autenticación con control de acceso
- 💾 Base de datos relacional con MySQL
- ⚡ UI rápida con React y Vite

---

## 🛠️ Tecnologías Utilizadas

### Frontend
- React
- Vite
- React Router
- Axios
- Bootstrap / Tailwind (según lo que uses)

### Backend
- Node.js
- Express.js
- MySQL
- Sequelize o MySQL2 (dependiendo del ORM/conector)
- JWT para autenticación

---

## 📂 Estructura del Proyecto

inventory-system/
├── frontend/ # Aplicación React + Vite
│ ├── src/
│ └── ...
├── backend/ # API Node.js + Express + MySQL
│ ├── controllers/
│ ├── routes/
│ ├── models/
│ └── ...
└── README.md



## ⚙️ Cómo Ejecutarlo en Local

### 1. Clona el repositorio
```bash
git clone https://github.com/tu-usuario/inventory-system.git
cd inventory-system
cd backend
npm install
# Crea un archivo .env con tu configuración:
# DB_HOST=localhost
# DB_USER=root
# DB_PASSWORD=tu_contraseña
# DB_NAME=ananda_db
npm run dev

cd ../frontend
npm install
npm run dev

✅ Funcionalidades Futuras (en desarrollo)
📦 Generación de reportes en Excel
👨‍💻 Autor
Gabriel Ramírez – @minombresgabriel

Técnico en informática | Desarrollador MERN & Node.js | Apasionado por soluciones eficientes


# 🛍️ Ananda Shop - Inventory and Sales System

**Ananda Shop is a complete web application developed with **React + Vite** for the frontend and **Node.js + Express + MySQL** for the backend. It is designed to manage inventory, sales and users efficiently for small to medium sized businesses.

---

## 🚀 Key Features.

- 📦 Product management (CRUD).
- 🧾 Sales registration with totals calculation.
- 📊 Dashboard with key metrics.
- 💾 Relational database with MySQL
- ⚡ Fast UI with React and Vite

---

## 🛠️ Technologies Used

### Frontend
- React
- Vite
- React Router
- Axios
- Bootstrap / Tailwind (depending on what you use)

### Backend
- Node.js
- Express.js
- MySQL
- Sequelize or MySQL2 (depending on ORM/connector)
- JWT for authentication

---

## 📂 Project Structure

inventory-system/
├── frontend/ # React + Vite application
│ ├── src/
│ └└── ...
├── backend/ # API Node.js + Express + MySQL
│ ├── controllers/
│ ├── routes/
│ │ ├── models/
│ └└── ...
└─── README.md



## ⚙️ How to Run It Locally

### 1. Clone the repository
````bash
git clone https://github.com/tu-usuario/inventory-system.git
cd inventory-system
cd backend
npm install
# Create an .env file with your configuration:
# DB_HOST=localhost
# DB_USER=root
# DB_PASSWORD=your_password
# DB_NAME=ananda_db
npm run dev

cd ../frontend
npm install
npm run dev

✅ Future functionalities (under development)
📦 Excel report generation
👨‍💻 Author
Gabriel Ramírez - @minombresgabriel

IT Technician | MERN & Node.js Developer | Passionate about efficient solutions

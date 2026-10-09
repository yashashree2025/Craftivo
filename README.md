# Craftivo – Handmade Product Discovery & Custom Creation Platform

Craftivo is a full-stack MERN web application that connects customers with artisans and allows them to discover, purchase, and request customized handmade products.

## Features

* **User Authentication:** Secure login and registration with role-based access for customers and artisans.
* **Product Discovery:** Browse and search handmade products by category and other filters.
* **Artisan Dashboard:** Manage products and artisan-related activities.
* **Custom Product Requests:** Submit requests for personalized handmade creations.
* **Shopping Cart & Wishlist:** Add products to the cart and save favorites.
* **Order Management:** Place orders and track order details.
* **Product Reviews:** Share feedback on purchased products.

## Tech Stack

* **Frontend:** React.js, HTML, CSS, JavaScript
* **Backend:** Node.js, Express.js
* **Database:** MongoDB
* **Authentication:** JSON Web Tokens (JWT)
* **Tools:** Git, GitHub, Postman, VS Code

## Project Structure

```text
Craftivo/
├── client/          # React frontend
├── server/          # Node.js and Express backend
├── .gitignore
└── README.md
```

## Getting Started

### Prerequisites

Install Node.js and MongoDB before running the project.

### 1. Clone the repository

```bash
git clone https://github.com/yashashree2025/Craftivo.git
cd Craftivo
```

### 2. Configure the backend

Navigate to the server folder and install dependencies:

```bash
cd server
npm install
```

Create a `.env` file inside the `server` folder with your own local configuration:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/craftivo
JWT_SECRET=your_new_secret
```

Add any other environment variables required by your backend configuration. Keep all real credentials private.

### 3. Start the backend

```bash
npm start
```

Use the appropriate script from `server/package.json` if your project uses a different start command.

### 4. Start the frontend

Open another terminal:

```bash
cd client
npm install
npm start
```

Use the appropriate script from `client/package.json` if required.

## Security

Environment files and API credentials must not be committed to GitHub. Configure your own local environment variables before running the application.

## Author

**Yashashree Parte**

MCA Student | MERN Stack Developer

# Smart Expenses Project

Smart Expenses is a web application to help users **manage, track, and split their expenses** easily.  
This project includes both a **backend** (API & database) and a **frontend** (user interface).

---

## 📂 Project Structure

### 🔹 Backend

The backend is responsible for managing **users, expenses, and authentication**.

**Folder structure (example):**

backend/

├── controllers/ # Logic for handling requests

├── models/ # Database models (User, Expense, etc.)

├── routes/ # API routes

├── middleware/ # Authentication

└── server.js # Entry point of the backend


**Technologies Used:**
- Node.js  
- Express.js  
- MongoDB / Mongoose  
- dotenv (for environment variables)  

**Setup:**

```

1. Navigate to the backend folder:  
   cd backend

2. Install dependencies:
    npm install

3. Create a .env file (not included in the repo for security) with your environment variables, e.g.:
    PORT=5000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_secret_key

4. Start the backend server:
    node server.js

```

### 🔹 Frontend

The frontend provides the user interface to interact with the backend.

**Folder structure (example):**

frontend/

├── src/

│   ├── components/     # Reusable UI components

│   ├── pages/          # Pages like Dashboard, Expenses, Login, Signup

│   ├── services/       # API calls to backend

│   ├── contexts/       # React Context (Auth, Theme, etc.)

│   └── App.jsx         # Main app component

├── public/             # Static files


**Technologies Used:**
- React.js 
- Tailwind CSS 
- Axios (for API calls)
- React Router DOM

**Setup:**

```

1. Navigate to the frontend folder:
    cd frontend

2. Install dependencies:
    npm install

3. Start the frontend server:
    npm run dev

```

## ✨ Features Implemented

- User Registration & Login
- Add, view, and manage expenses
- Dashboard showing total expenses and breakdown
- Responsive UI
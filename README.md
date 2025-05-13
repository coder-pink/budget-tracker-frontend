# 💰 Personal Budget Tracker – MERN Stack

A full-featured Personal Budget Tracker built using the MERN stack (MongoDB, Express.js, React.js, Node.js) that enables users to securely manage their finances. This application allows users to track income and expenses, set and compare monthly budgets, and visualize financial data using interactive D3.js charts.

## 🚀 Features

- 🔐 **Secure Authentication**  
  User registration and login with JWT-based authentication to keep your data safe.

- 💵 **Track Income & Expenses**  
  Add, edit, delete, and filter income and expense transactions.

- 📊 **Set Monthly Budgets**  
  Set and compare your monthly budgets against actual expenses.

- 📈 **Data Visualization with D3.js**  
  Interactive and responsive charts to visualize income vs. expenses, category-wise breakdowns, and trends.

- 🔍 **Filtering & Editing**  
  Easily filter transactions by category, date, or amount and make changes as needed.

## 🛠️ Tech Stack

- **Frontend**: React.js, Tailwind CSS, Axios, D3.js ,React Router,React Hot Toast
- **Backend**: Node.js, Express.js  
- **Database**: MongoDB with Mongoose ORM  
- **Authentication**: JSON Web Tokens (JWT), Bcrypt, express-validator, cors

## 📁 Project Structure

### Frontend

### Installation

```bash
git clone 
```


```bash
cd client
npm install

```

```bash
npm run dev
```

## 📊 Key Pages & Components

Below is an overview of the main routes and their functionality in the Personal Budget Tracker app:

| Route              | Description                                                                 |
|-------------------|-----------------------------------------------------------------------------|
| `/login`           | User login page for accessing the dashboard                                |
| `/signup`          | Register a new user with secure authentication                             |
| `/dashboard`       | Main financial overview with summary cards and interactive D3.js charts    |
| `/transactions`    | View all transactions, filter by date/category, edit or delete entries     |
| `/add-transaction` | Add new income or expense transactions to the tracker                      |
| `/budget`          | Set and manage monthly budget, compare against actual expenses with charts |

### 📁 Core Components

- **Auth Components** – Login, Signup, and ProtectedRoute logic  
- **Dashboard** – Displays income/expense summary and visual analytics  
- **Transaction Manager** – Add, edit, delete, and filter transactions  
- **Budget Planner** – Set budgets and visualize spending vs. budget  
- **D3.js Charts** – Interactive bar/line/pie charts for financial trends  


## 📈 Charts

Reusable and interactive D3.js components for visualizing financial data:

- **Category-wise Expenses**  
  Pie and Bar chart toggle to show expense distribution by category.

- **Budget vs. Actual Expense**  
  Bar chart comparing monthly budget with actual spending.

- **Responsive & Animated**  
  Charts are fully responsive and include smooth transition animations for a better user experience.

---

## 🔥 Enhancements

- ✅ **Toast Notifications**  
  Feedback messages for actions like adding, editing, or deleting transactions.

- ⏳ **Loading Spinners**  
  Indicate async operations such as data fetching and form submission.

- 📱 **Responsive Sidebar Layout**  
  A mobile-friendly and collapsible sidebar for seamless navigation across devices.


## Backend

### Installation

```bash
git clone 
```


```bash
cd server
npm install

```

- ADD neccesssary crediential in .env 

- Email : ar@gmail.com
- Password : Ariya12

```bash
npm run dev
```


## 🛠️ API Endpoints

The backend provides the following RESTful API endpoints for authentication, transaction management, and budgeting.

| Method | Endpoint                     | Description                               |
|--------|------------------------------|-------------------------------------------|
| POST   | `/api/auth/register`         | Register a new user                       |
| POST   | `/api/auth/login`            | Login and receive JWT access & refresh tokens |
| POST   | `/api/auth/refresh`          | Refresh the access token using refresh token |
| GET    | `/api/transactions`          | Retrieve all transactions for the logged-in user |
| POST   | `/api/transactions`          | Add a new income or expense transaction   |
| PUT    | `/api/transactions/:id`      | Edit an existing transaction by its ID    |
| DELETE | `/api/transactions/:id`      | Delete a transaction by its ID            |
| GET    | `/api/budget`                | Get the current month’s budget            |
| POST   | `/api/budget`                | Set or update the monthly budget          |


![Screenshot (1414)](https://github.com/user-attachments/assets/7772ba93-e77e-4f6f-a5c7-40c71aaf2671)


![Screenshot (1415)](https://github.com/user-attachments/assets/5db348b6-e97c-4dfa-aa63-2f315578841f)



![Screenshot (1416)](https://github.com/user-attachments/assets/afe4e349-e29e-4311-8486-97772042d7ca)


![Screenshot (1417)](https://github.com/user-attachments/assets/377bb6e0-7a8e-4d1c-a82b-29889c3b910d)



![Screenshot (1418)](https://github.com/user-attachments/assets/56af1088-43bd-425b-a5ea-1dbd631a482f)

![Screenshot (1419)](https://github.com/user-attachments/assets/a63cf8fa-dc5b-4168-ad3d-72bfc5772326)



![Screenshot (1420)](https://github.com/user-attachments/assets/8c1ecbf5-658c-4813-873e-9370c3747f66)





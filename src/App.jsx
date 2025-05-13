import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import AddTransaction from "./pages/AddTransaction";
import Budget from "./pages/Budget";
import Sidebar from "./components/Sidebar";
import { BudgetProvider } from "./context/BudgetContext";

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 ml-64">
        {children}
      </main>
    </div>
  ) : (
    <Navigate to="/login" />
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <BudgetProvider>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/transactions"
            element={
              <PrivateRoute>
                <Transactions />
              </PrivateRoute>
            }
          />
          <Route
            path="/add-transaction"
            element={
              <PrivateRoute>
                <AddTransaction />
              </PrivateRoute>
            }
          />
          <Route
            path="/budget"
            element={
              <PrivateRoute>
                <Budget />
              </PrivateRoute>
            }
            
          />
         
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
        </BudgetProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;

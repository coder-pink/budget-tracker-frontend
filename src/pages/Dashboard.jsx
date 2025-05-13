import SummaryCard from "../components/SummaryCard";
import ExpenseBarChart from "../components/ExpenseBarChart";
import { useState, useEffect } from "react";
import api from "../api/api";
import { ChartBarIcon, ExclamationCircleIcon } from "@heroicons/react/24/outline";

const Dashboard = () => {
  const [income, setIncome] = useState(0);
  const [expenses, setExpenses] = useState(0);
  const [categoryData, setCategoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await api.get('/dashboard');
        const data = response.data;
        
        // Format the data
        setIncome(data.income || 0);
        setExpenses(data.expenses || 0);
        
        // Ensure categoryData is properly formatted
        const formattedCategoryData = (data.categoryData || []).map(item => ({
          category: item.category || 'Uncategorized',
          amount: Number(item.amount) || 0
        }));
        
        setCategoryData(formattedCategoryData);
        setError(null);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const balance = income - expenses;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
          <div className="text-sm text-gray-500">
            {new Date().toLocaleDateString('default', { month: 'long', year: 'numeric' })}
          </div>
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-center mb-6">
            <ExclamationCircleIcon className="h-5 w-5 mr-2" />
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <SummaryCard label="Income" value={income} color="green" />
          <SummaryCard label="Expenses" value={expenses} color="red" />
          <SummaryCard label="Balance" value={balance} color="blue" />
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Spending by Category</h2>
            <ChartBarIcon className="h-6 w-6 text-indigo-600" />
          </div>
          {loading ? (
            <div className="h-64 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          ) : categoryData.length > 0 ? (
            <ExpenseBarChart data={categoryData} />
            // <ExpenseBarChart data={expenses} />
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">
              No expense data available
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

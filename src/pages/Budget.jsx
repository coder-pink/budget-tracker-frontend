
import {
  CurrencyDollarIcon,
  ChartBarIcon,
  ExclamationCircleIcon
} from "@heroicons/react/24/outline";
import BudgetForm from "../components/BudgetForm";
import ExpenseBarChart from "../components/ExpenseBarChart";
import { useBudget } from "../context/BudgetContext";

const Budget = () => {
  const {
    budget,
    expenses,
    loading,
    error,
    totalExpenses,
    remainingBudget,
    budgetProgress,
    fetchData
  } = useBudget();

  const formattedAmount = (amount) => (amount ? amount.toLocaleString() : "0");
  const formattedProgress = (progress) => (progress ? progress.toFixed(1) : "0");

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Budget Management</h1>
          <div className="text-sm text-gray-500">
            {budget &&
              `For ${new Date(budget.month).toLocaleDateString("default", {
                month: "long",
                year: "numeric"
              })}`}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-center mb-6">
            <ExclamationCircleIcon className="h-5 w-5 mr-2" />
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Set Monthly Budget</h2>
              <CurrencyDollarIcon className="h-6 w-6 text-indigo-600" />
            </div>
            <BudgetForm month={new Date().toISOString().slice(0, 7)} refresh={fetchData} />
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Current Budget Status</h2>
              <ChartBarIcon className="h-6 w-6 text-indigo-600" />
            </div>
            {loading ? (
              <div className="h-64 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              </div>
            ) : budget ? (
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-600">Total Budget</span>
                    <span className="text-lg font-bold text-indigo-600">
                      ${formattedAmount(budget.amount)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-600">Total Expenses</span>
                    <span className="text-lg font-bold text-red-600">
                      ${formattedAmount(totalExpenses)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-600">Remaining</span>
                    <span className={`text-lg font-bold ${remainingBudget >= 0 ? "text-green-600" : "text-red-600"}`}>
                      ${formattedAmount(remainingBudget)}
                    </span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-600">Budget Progress</span>
                    <span className="text-sm font-medium text-gray-600">
                      {formattedProgress(budgetProgress)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className={`h-2.5 rounded-full ${budgetProgress > 100 ? "bg-red-600" : "bg-indigo-600"}`}
                      style={{ width: `${Math.min(budgetProgress, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-gray-500 text-center py-8">No budget set for this month</div>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Expenses by Category</h2>
            <ChartBarIcon className="h-6 w-6 text-indigo-600" />
          </div>
          {loading ? (
            <div className="h-64 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          ) : expenses.length > 0 ? (
            <ExpenseBarChart data={expenses} />
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

export default Budget;

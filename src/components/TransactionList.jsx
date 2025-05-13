import { useState, useEffect } from "react";
import api from "../api/api";
import { toast } from "react-hot-toast";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

const TransactionList = ({ filters, onEdit }) => {
  const [data, setData] = useState({
    transactions: [],
    total: 0,
    currentPage: 1,
    totalPages: 1
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(null);


  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const params = {
          ...filters,
          page: data.currentPage,
          limit: 5
        };
        const res = await api.get("/transactions", { params });
        // Ensure we have valid numbers for pagination
        const responseData = {
          transactions: res.data.transactions || [],
          total: parseInt(res.data.total) || 0,
          currentPage: parseInt(res.data.currentPage) || 1,
          totalPages: parseInt(res.data.totalPages) || 1
        };
        setData(responseData);
        setError(null);
      } catch (err) {
        console.error("Error fetching transactions:", err);
        setError("Failed to load transactions");
        toast.error("Failed to load transactions");
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, [filters, data.currentPage]);

  const handlePageChange = (newPage) => {
    setData(prev => ({ ...prev, currentPage: newPage }));
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this transaction?")) {
      return;
    }

    try {
      setDeleteLoading(id);
      await api.delete(`/transactions/${id}`);
      setData(prev => ({
        ...prev,
        transactions: prev.transactions.filter(tx => tx._id !== id),
        total: prev.total - 1
      }));
      toast.success("Transaction deleted successfully");
    } catch (err) {
      console.error("Error deleting transaction:", err);
      toast.error("Failed to delete transaction");
    } finally {
      setDeleteLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg shadow-sm">
        <p className="font-medium">{error}</p>
      </div>
    );
  }

  if (data.transactions.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <p className="text-gray-600 font-medium">No transactions found</p>
        <p className="text-gray-500 text-sm mt-1">Try adjusting your filters or add a new transaction</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.transactions.map((transaction) => (
              <tr key={transaction._id} className="hover:bg-gray-50 transition-colors duration-150">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {new Date(transaction.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{transaction.title}</div>
                  {transaction.description && (
                    <div className="text-sm text-gray-500 mt-0.5">{transaction.description}</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                    {transaction.category}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <span className={transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}>
                    {transaction.type === 'income' ? '' : ''}${Math.abs(transaction.amount).toLocaleString()}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                    transaction.type === 'income' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {transaction.type}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex space-x-3">
                    <button
                      onClick={() => onEdit(transaction)}
                      className="text-indigo-600 hover:text-indigo-900 transition-colors duration-150"
                      title="Edit transaction"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(transaction._id)}
                      disabled={deleteLoading === transaction._id}
                      className="text-red-600 hover:text-red-900 transition-colors duration-150 disabled:opacity-50"
                      title="Delete transaction"
                    >
                      {deleteLoading === transaction._id ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-600"></div>
                      ) : (
                        <TrashIcon className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
        <div className="flex-1 flex justify-between sm:hidden">
          <button
            onClick={() => handlePageChange(data.currentPage - 1)}
            disabled={data.currentPage === 1}
            className="relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
          >
            Previous
          </button>
          <button
            onClick={() => handlePageChange(data.currentPage + 1)}
            disabled={data.currentPage === data.totalPages}
            className="ml-3 relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
          >
            Next
          </button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">
                {data.transactions.length > 0 ? ((data.currentPage - 1) * 10) + 1 : 0}
              </span> to{' '}
              <span className="font-medium">
                {data.transactions.length > 0 ? Math.min((data.currentPage * 10), data.total) : 0}
              </span>{' '}
              of <span className="font-medium">{data.total}</span> results
            </p>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button
                onClick={() => handlePageChange(data.currentPage - 1)}
                disabled={data.currentPage === 1}
                className="relative inline-flex items-center px-3 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
              >
                Previous
              </button>
              <button
                onClick={() => handlePageChange(data.currentPage + 1)}
                disabled={data.currentPage === data.totalPages}
                className="relative inline-flex items-center px-3 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
              >
                Next
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionList;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import { toast } from "react-hot-toast";
import TransactionList from "../components/TransactionList";
import TransactionFilters from "../components/TransactionFilters";
import { PlusCircleIcon } from "@heroicons/react/24/outline";

const Transactions = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({});
  const [refreshKey, setRefreshKey] = useState(0);



  const handleEdit = (transaction) => {
    navigate('/add-transaction', { state: { transaction } });
  };
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this transaction?')) {
      return;
    }

    try {
      await api.delete(`/transactions/${id}`);
      toast.success('Transaction deleted successfully');
      setRefreshKey(prev => prev + 1);
    } catch (error) {
      console.error('Error deleting transaction:', error);
      toast.error('Failed to delete transaction');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Transactions</h1>
        <button
          onClick={() => navigate('/add-transaction')}
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <PlusCircleIcon className="h-5 w-5 mr-2" />
          Add Transaction
        </button>
      </div>

      <div className="space-y-6">
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <TransactionFilters filters={filters} setFilters={setFilters} />
          </div>
        </div>

        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <TransactionList
              key={refreshKey}
              filters={filters}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transactions;

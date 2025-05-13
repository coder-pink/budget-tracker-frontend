import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../api/api";
import { toast } from "react-hot-toast";
import TransactionForm from "../components/TransactionForm";

const AddTransaction = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const editingTransaction = location.state?.transaction;
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data) => {
    try {
      setLoading(true);
      
      const transactionData = {
        title: data.title,
        amount: parseFloat(data.amount),
        type: data.type,
        category: data.category,
        date: new Date(data.date).toISOString(),
        description: data.description || ""
      };

      if (editingTransaction) {
        
        await api.put(`/transactions/${editingTransaction._id}`, transactionData);
        toast.success('Transaction updated successfully');
      } else {
        
        await api.post('/transactions', transactionData);
        toast.success('Transaction added successfully');
      }
      
      navigate('/transactions');
    } catch (error) {
      console.error('Error saving transaction:', error.response?.data || error);
      toast.error(error.response?.data?.message || 'Failed to save transaction');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/transactions');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            {editingTransaction ? 'Edit Transaction' : 'Add New Transaction'}
          </h2>
          <TransactionForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            onSuccess={() => navigate('/transactions')}
            initialData={editingTransaction}
          />
        </div>
      </div>
    </div>
  );
};

export default AddTransaction;

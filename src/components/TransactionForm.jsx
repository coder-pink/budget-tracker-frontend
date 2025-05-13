import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import api from "../api/api";
import { toast } from "react-hot-toast";

const TransactionForm = ({ onSubmit, onCancel, initialData }) => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [categorySuggestions, setCategorySuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    defaultValues: {
      title: initialData?.title || "",
      amount: initialData?.amount ? Math.abs(initialData.amount) : "",
      type: initialData?.type || "expense",
      category: initialData?.category || "",
      date: initialData?.date ? new Date(initialData.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      description: initialData?.description || ""
    }
  });

  const categoryInput = watch("category");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/transactions/categories');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast.error('Failed to load categories');
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (categoryInput) {
      const filtered = categories.filter(cat =>
        cat.toLowerCase().includes(categoryInput.toLowerCase())
      );
      setCategorySuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, [categoryInput, categories]);

  const handleFormSubmit = async (data) => {
    try {
      setLoading(true);
      await onSubmit(data);
    } catch (error) {
      console.error('Error submitting transaction:', error);
      toast.error(error.response?.data?.message || 'Failed to save transaction');
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setValue("category", suggestion);
    setShowSuggestions(false);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
        <div>
          <label htmlFor="title" className="block text-base font-medium text-gray-700 mb-2">
            Title
          </label>
          <input
            type="text"
            id="title"
            {...register("title", { required: "Title is required" })}
            className="block w-full px-4 py-3 text-base rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Enter transaction title"
          />
          {errors.title && (
            <p className="mt-2 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="amount" className="block text-base font-medium text-gray-700 mb-2">
            Amount
          </label>
          <div className="relative rounded-lg shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <span className="text-gray-500 text-lg">$</span>
            </div>
            <input
              type="number"
              step="0.01"
              id="amount"
              {...register("amount", {
                required: "Amount is required",
                min: { value: 0.01, message: "Amount must be greater than 0" }
              })}
              className="pl-8 block w-full px-4 py-3 text-base rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="0.00"
            />
          </div>
          {errors.amount && (
            <p className="mt-2 text-sm text-red-600">{errors.amount.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="type" className="block text-base font-medium text-gray-700 mb-2">
            Type
          </label>
          <select
            id="type"
            {...register("type", { required: "Type is required" })}
            className="block w-full px-4 py-3 text-base rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
          {errors.type && (
            <p className="mt-2 text-sm text-red-600">{errors.type.message}</p>
          )}
        </div>

        <div className="relative">
          <label htmlFor="category" className="block text-base font-medium text-gray-700 mb-2">
            Category
          </label>
          <input
            type="text"
            id="category"
            {...register("category", { required: "Category is required" })}
            className="block w-full px-4 py-3 text-base rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Enter category"
            autoComplete="off"
          />
          {errors.category && (
            <p className="mt-2 text-sm text-red-600">{errors.category.message}</p>
          )}
          {showSuggestions && categorySuggestions.length > 0 && (
            <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-lg border border-gray-200 max-h-60 overflow-auto">
              {categorySuggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="px-4 py-3 hover:bg-gray-50 cursor-pointer text-base"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion}
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <label htmlFor="date" className="block text-base font-medium text-gray-700 mb-2">
            Date
          </label>
          <input
            type="date"
            id="date"
            {...register("date", { required: "Date is required" })}
            className="block w-full px-4 py-3 text-base rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          {errors.date && (
            <p className="mt-2 text-sm text-red-600">{errors.date.message}</p>
          )}
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="description" className="block text-base font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            id="description"
            rows={4}
            {...register("description")}
            className="block w-full px-4 py-3 text-base rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Enter transaction description (optional)"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-4 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-150"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 text-base font-medium text-white bg-indigo-600 border border-transparent rounded-lg shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
        >
          {loading ? (
            <div className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </div>
          ) : (
            initialData ? 'Update Transaction' : 'Add Transaction'
          )}
        </button>
      </div>
    </form>
  );
};

export default TransactionForm;

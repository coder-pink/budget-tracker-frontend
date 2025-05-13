import { useForm } from "react-hook-form";
import api from "../api/api";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { CurrencyDollarIcon } from "@heroicons/react/24/outline";

const BudgetForm = ({ month, refresh }) => {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm();
  const [loading, setLoading] = useState(false);



  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const formattedMonth = new Date(`${month}-01T00:00:00.000Z`);
      await api.post("/budget", {
        amount: Number(data.amount),
        month: formattedMonth.toISOString()
      });
      toast.success('Budget set successfully');
      refresh();
      reset();
    } catch (error) {
      console.error('Error setting budget:', error);
      toast.error(error.response?.data?.message || 'Failed to set budget');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label htmlFor="amount" className="block text-base font-medium text-gray-700 mb-2">
          Monthly Budget Amount
        </label>
        <div className="relative rounded-lg shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <CurrencyDollarIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="amount"
            type="number"
            step="0.01"
            min="0"
            {...register("amount", {
              required: "Budget amount is required",
              min: { value: 0, message: "Budget must be greater than 0" }
            })}
            className="pl-12 block w-full px-4 py-3 text-base rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="0.00"
          />
        </div>
        {errors.amount && (
          <p className="mt-2 text-sm text-red-600">{errors.amount.message}</p>
        )}
      </div>

      <div className="flex items-center justify-between pt-2">
        <div className="text-sm text-gray-500">
          {month && `Setting budget for ${new Date(month).toLocaleDateString('default', { month: 'long', year: 'numeric' })}`}
        </div>
        <button
          type="submit"
          disabled={loading || isSubmitting}
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
        >
          {loading ? (
            <div className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Setting budget...
            </div>
          ) : (
            'Set Budget'
          )}
        </button>
      </div>
    </form>
  );
};

export default BudgetForm;

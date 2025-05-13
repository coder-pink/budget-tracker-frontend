import { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../api/api";
import { toast } from "react-hot-toast";

const BudgetContext = createContext();

export const useBudget = () => useContext(BudgetContext);

export const BudgetProvider = ({ children }) => {
  const [budget, setBudget] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [remainingBudget, setRemainingBudget] = useState(0);
  const [budgetProgress, setBudgetProgress] = useState(0);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [budgetRes, expensesRes] = await Promise.all([
        api.get("/budget"),
        api.get("/transactions")
      ]);

      const formatMonth = (date) => {
        const d = new Date(date);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      };

      const currentMonth = formatMonth(new Date());

      const currentBudget = budgetRes.data.find(b =>
        formatMonth(b.month) === currentMonth
      );

      setBudget(currentBudget || null);

      const categoryData = expensesRes.data.transactions
        .filter(tx => tx.type === 'expense')
        .reduce((acc, tx) => {
          const existing = acc.find(item => item.category === tx.category);
          if (existing) {
            existing.amount += Number(tx.amount);
          } else {
            acc.push({ category: tx.category, amount: Number(tx.amount) });
          }
          return acc;
        }, []);

      const total = categoryData.reduce((sum, item) => sum + item.amount, 0);
      setTotalExpenses(total);
      setExpenses(categoryData);

      if (currentBudget && currentBudget.amount) {
        const remaining = currentBudget.amount - total;
        setRemainingBudget(remaining);
        setBudgetProgress((total / currentBudget.amount) * 100);
      } else {
        setRemainingBudget(0);
        setBudgetProgress(0);
      }

      setError(null);
    } catch (err) {
      console.error("Error fetching budget data:", err);
      setError("Failed to load budget data");
      toast.error("Failed to load budget data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <BudgetContext.Provider
      value={{
        budget,
        expenses,
        loading,
        error,
        totalExpenses,
        remainingBudget,
        budgetProgress,
        fetchData
      }}
    >
      {children}
    </BudgetContext.Provider>
  );
};

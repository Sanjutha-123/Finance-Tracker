import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getCategories,
  getTransactionById,
  updateTransaction
} from "../Api/auth";
import "../Styles/TransactionCategory.css";

const EditTransaction = () => {
  const { id } = useParams();          // ✅ get ID from URL
  const navigate = useNavigate();

  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense");
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");

  // ✅ Load categories + transaction
  useEffect(() => {
    fetchCategories();
    fetchTransaction();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch {
      setError("Failed to load categories");
    }
  };

  const fetchTransaction = async () => {
    try {
      const data = await getTransactionById(id);

      setAmount(data.amount);
      setType(data.type.toLowerCase());
      setCategoryId(data.categoryId);
      setDescription(data.description || "");
    } catch {
      setError("Failed to load transaction");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!amount || Number(amount) <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    if (!categoryId) {
      setError("Please select a category");
      return;
    }

    try {
      await updateTransaction(id, {
        amount: Number(amount),
        type: type === "expense" ? "Expense" : "Income",
        categoryId: Number(categoryId),
        description
      });

     alert("✅ Transaction updated successfully");

      // ✅ Go back to list
      navigate("/transactionlist");

    } catch {
      setError("Failed to update transaction");
    }
  };

  return (
    <div className="card">
      <h2>Edit Transaction</h2>

      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit}>
        <label>Amount</label>
        <input
          type="number"
          value={amount}
          min="1"
          required
          onChange={(e) => setAmount(e.target.value)}
        />

        <label>Type</label>
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>

        <label>Category</label>
        <select
          value={categoryId}
          required
          onChange={(e) => setCategoryId(e.target.value)}
        >
          <option value="">Select Category</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <label>Note</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button className="btn-primary" type="submit">
          Update Transaction
        </button>
      </form>
    </div>
  );
};

export default EditTransaction;

import { useEffect, useState } from "react";
import { addTransaction, getCategories } from "../Api/auth";
import "../TransactionCategory.css";

const AddTransaction = () => {
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense");
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");

  // Load categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch {
        setError("Failed to load categories");
      }
    };
    fetchCategories();
  }, []);

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
      await addTransaction({
          amount: Number(amount),
          type: type === "expense" ? "Expense" : "Income",
          categoryId: Number(categoryId),
          description: description || ""
      });

      alert("Transaction added successfully ");

      setAmount("");
      setCategoryId("");
      setDescription("");
      setType("expense");
    } catch {
      setError("Failed to add transaction");
    }
  };

  return (
    <div className="card">
      <h2>Add Transaction</h2>

      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit}>
        <label>Amount</label>
        <input
          type="number"
          placeholder="Enter a amount"
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
          onChange={(e) => setCategoryId(e.target.value)}
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <label>Note</label>
        <textarea
          placeholder="Optional note..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button className="btn-primary" type="submit">
          Add Transaction
        </button>
      </form>
    </div>
  );
};

export default AddTransaction;

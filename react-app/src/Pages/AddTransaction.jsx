import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import { addTransaction, getCategories } from "../Api/auth";
import "../Styles/TransactionCategory.css";
import Sidebar from "../Components/Sidebar";

const AddTransaction = () => {
  const navigate = useNavigate(); 

  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense");
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");

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
        description: description || "",
        date: date,
      });

      alert(" Transaction added successfully");
      navigate("/transactionlist"); 
    } catch {
      setError("Failed to add transaction");
    }
  };

  return ( 
    
    <div className="layout">
        {/* Sidebar */}
        <Sidebar />

    <div className="page-wrapper">
      <div className="card">
        <h2>Add Transaction</h2>
        {error && <p className="error">{error}</p>}

        <form onSubmit={handleSubmit}>
          <label>Amount</label>
          <input
            type="number"
            placeholder="Enter amount"
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
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          <label>Date</label>
          <input
            type="date"
            value={date}
            required
            onChange={(e) => setDate(e.target.value)}
          />

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
    </div>
    </div>
 
);

};
export default AddTransaction;

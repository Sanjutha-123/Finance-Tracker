import { useState, useEffect } from "react";
import { 
  getCategory, 
  addCategory, 
  addTransaction, 
  getTransactions, 
  deleteTransaction, 
  updateTransaction 
} from "../Api/auth";
import "../TransactionCategory.css";

const Dashboard = () => {
  // Transaction form state
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("Expense");
  const [categoryId, setCategoryId] = useState("");
  const [date, setDate] = useState("");
  const [note, setNote] = useState("");

  // Category state
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");

  // Transaction list state
  const [transactions, setTransactions] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ amount: "", note: "" });

  const [error, setError] = useState("");

  // Fetch categories
  const fetchCategories = () => {
    getCategory()
      .then((res) => setCategories(res.data))
      .catch((err) => setError("Failed to load categories"));
  };

  // Fetch transactions
  const fetchTransactions = () => {
    getTransactions()
      .then((res) => setTransactions(res.data))
      .catch((err) => setError("Failed to load transactions"));
  };

  useEffect(() => {
    fetchCategories();
    fetchTransactions();
  }, []);

  // Add new category
  const handleAddCategory = async () => {
    if (!newCategory) return alert("Enter category name");
    try {
      await addCategory(newCategory);
      setNewCategory("");
      fetchCategories();
    } catch (err) {
      setError("Failed to add category");
    }
  };

  // Add transaction
  const handleAddTransaction = async (e) => {
    e.preventDefault();
    try {
      await addTransaction({ amount, type, categoryId, date, note });
      alert("Transaction Added");
      // Clear form
      setAmount(""); setCategoryId(""); setDate(""); setNote(""); setType("Expense");
      fetchTransactions();
    } catch (err) {
      setError("Failed to add transaction");
    }
  };

  // Delete transaction
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this transaction?")) return;
    try {
      await deleteTransaction(id);
      setTransactions(transactions.filter(t => t.id !== id));
    } catch (err) {
      setError("Failed to delete transaction");
    }
  };

  // Edit transaction
  const handleEdit = (t) => {
    setEditingId(t.id);
    setEditData({ amount: t.amount, note: t.note });
  };

  const handleSave = async (id) => {
    try {
      await updateTransaction(id, editData);
      setTransactions(transactions.map(t => t.id === id ? { ...t, ...editData } : t));
      setEditingId(null);
    } catch (err) {
      setError("Failed to update transaction");
    }
  };

  return (
    <div className="tc-container">
      {/* ===== Add Transaction + Add Category ===== */}
      <div className="card">
        <h2>Add Transaction</h2>

        <label>Amount</label>
        <input 
          type="number" 
          value={amount} 
          onChange={(e) => setAmount(e.target.value)} 
        />

        <label>Type</label>
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="Expense">Expense</option>
          <option value="Income">Income</option>
        </select>

        <label>Select Category</label>
        <select 
          value={categoryId} 
          onChange={(e) => setCategoryId(e.target.value)}
        >
          <option value="">Select Category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        <label>Date</label>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />

        <label>Note</label>
        <textarea value={note} onChange={(e) => setNote(e.target.value)} />

        <button className="btn-primary" onClick={handleAddTransaction}>
          Add Transaction
        </button>

        <h3>Add New Category</h3>
        <input 
          type="text" 
          placeholder="New Category Name" 
          value={newCategory} 
          onChange={(e) => setNewCategory(e.target.value)}
        />
        <button className="btn-success" onClick={handleAddCategory}>
          Add Category
        </button>

        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>

      {/* ===== Transaction List ===== */}
      <div className="card" style={{ width: "100%", maxWidth: "600px" }}>
        <h2>Transaction List</h2>
        <table className="category-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Amount</th>
              <th>Note</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t) => (
              <tr key={t.id}>
                <td>{t.id}</td>
                <td>
                  {editingId === t.id ? (
                    <input 
                      type="number" 
                      value={editData.amount} 
                      onChange={(e) => setEditData({ ...editData, amount: e.target.value })}
                    />
                  ) : t.amount}
                </td>
                <td>
                  {editingId === t.id ? (
                    <input 
                      type="text" 
                      value={editData.note} 
                      onChange={(e) => setEditData({ ...editData, note: e.target.value })}
                    />
                  ) : t.note}
                </td>
                <td>
                  {editingId === t.id ? (
                    <>
                      <button className="btn-success" onClick={() => handleSave(t.id)}>Save</button>
                      <button className="btn-primary" onClick={() => setEditingId(null)}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <button className="btn-success" onClick={() => handleEdit(t)}>Edit</button>
                      <button className="btn-primary" onClick={() => handleDelete(t.id)}>Delete</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;

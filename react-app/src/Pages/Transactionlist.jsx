import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getTransactions, getCategories, deleteTransaction } from "../Api/auth";
import "../Styles/Transaction.css";

import Sidebar from "../Components/Sidebar";

export default function TransactionList() {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filter, setFilter] = useState("All");
  const [selectedRows, setSelectedRows] = useState([]);

  // Fetch transactions and categories
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const transResponse = await getTransactions();
      const catResponse = await getCategories();

      // Ensure always arrays
      setTransactions(transResponse?.data || transResponse || []);
      setCategories(catResponse?.data || catResponse || []);
    } catch (err) {
      console.error("Failed to fetch data", err);
      setTransactions([]);
      setCategories([]);
    }
  };

  // Map categoryId -> name safely
  const categoryMap = Array.isArray(categories)
    ? categories.reduce((acc, cat) => {
        if (cat?.id != null && cat?.name != null) {
          acc[cat.id] = cat.name;
        }
        return acc;
      }, {})
    : {};

  // Handlers
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this transaction?")) return;
    try {
      await deleteTransaction(id);
      fetchData(); // refresh list
    } catch {
      alert("Failed to delete transaction");
    }
  };

  const handleEdit = (id) => navigate(`/edittransaction/${id}`);

  const handleSelectRow = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRows(transactions.map((t) => t.id));
    } else {
      setSelectedRows([]);
    }
  };

  const filteredTransactions = transactions.filter((t) => {
    if (filter === "All") return true;
    return t.type?.toLowerCase() === filter.toLowerCase();
  });

  // Format date
  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    if (isNaN(date)) return "-";
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  return (
    <div className="layout">
                {/* Sidebar */}
                <Sidebar />
    <div className="transaction-container">
      {/* Header */}
      <h1 className="transaction-header mb-2">Transaction List</h1>

      {/* Tabs with Create button on right */}
      <div
        className="transaction-tabs-container mb-4"
        style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
      >
        <div className="transaction-tabs">
          {["All", "Income", "Expense"].map((f) => (
            <button
              key={f}
              className={`transaction-tab ${filter === f ? "active" : ""}`}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>

        <button
          className="action-btn create"
          onClick={() => navigate("/addtransaction")}
        >
          Create
        </button>
      </div>

      {/* Table */}
      <div className="transaction-table-container">
        <table className="transaction-table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={
                    selectedRows.length === transactions.length &&
                    transactions.length > 0
                  }
                />
              </th>
              <th>Date</th>
              <th>Category</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Note</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredTransactions.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                  No transactions available
                </td>
              </tr>
            )}

            {filteredTransactions.map((t) => (
              <tr key={t.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(t.id)}
                    onChange={() => handleSelectRow(t.id)}
                  />
                </td>

                <td>{formatDate(t.Datetime || t.datetime || t.date)}</td>

                {/* Show category name safely */}
                <td>{categoryMap[t.categoryId] || "Unknown"}</td>

                <td>
                  <span className={`badge ${t.type?.toLowerCase()}`}>
                    {t.type || "-"}
                  </span>
                </td>
                <td>₹{t.amount || 0}</td>
                <td>{t.description || "-"}</td>
                <td className="flex gap-2">
                  <button className="action-btn edit" onClick={() => handleEdit(t.id)}>Edit</button>
                  <button className="action-btn delete" onClick={() => handleDelete(t.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
      </div>
  );
}

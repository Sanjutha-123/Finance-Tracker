// TransactionList.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getTransactions, getCategories, deleteTransaction ,downloadTransactionsCsv   } from "../Api/auth";
import "../Styles/Transactionlist.css";
import Sidebar from "../Components/Sidebar";

export default function TransactionList() {
  const navigate = useNavigate();

  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filterType, setFilterType] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [categoryId, setCategoryId] = useState("All");
  const [selectedRows, setSelectedRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false); // CSV download state

  // Fetch categories once
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const catResponse = await getCategories();
        const catData = catResponse?.data || catResponse || [];
        setCategories(catData);
      } catch (err) {
        console.error("Failed to fetch categories", err);
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);

  // Fetch transactions on load and whenever filters change
  useEffect(() => {
    fetchTransactions();
  }, [filterType, categoryId, startDate, endDate]);

  const formatDateForBackend = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filterType !== "All") params.type = filterType.toLowerCase();
      if (categoryId && categoryId !== "All") params.categoryId = categoryId;
      if (startDate) params.start = formatDateForBackend(startDate);
      if (endDate) params.end = formatDateForBackend(endDate);

      const transResponse = await getTransactions(params);
      const txData = (transResponse?.data || transResponse || []).map((t) => ({
        id: t.id ?? t.Id ?? t.transactionId,
        type: t.type ?? t.Type ?? t.transactionType,
        categoryId: t.categoryId ?? t.CategoryId ?? t.categoryID,
        amount: Number(t.amount ?? t.Amount ?? 0),
        description: t.description ?? t.Description ?? "",
        date: t.date ?? t.datetime ?? t.Datetime ?? t.createdAt ?? "",
      }));

      setTransactions(txData);
      setSelectedRows([]);
    } catch (err) {
      console.error("Failed to fetch transactions", err.response || err.message);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };
//CSV file
const handleDownload = async () => {
  try {
    const userId = localStorage.getItem("userId");

    const blob = await downloadTransactionsCsv(userId);

    const url = window.URL.createObjectURL(
      new Blob([blob], { type: "text/csv" })
    );

    const a = document.createElement("a");
    a.href = url;
    a.download = "transactions.csv";
    a.click();

    window.URL.revokeObjectURL(url);
  } catch (error) {
    alert("No transactions found or download failed");
  }
};


  // Map categoryId -> name
  const categoryMap = {};
  categories.forEach((cat) => {
    if (cat?.id != null && cat?.name != null) categoryMap[String(cat.id)] = cat.name;
  });

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this transaction?")) return;
    try {
      await deleteTransaction(id);
      fetchTransactions();
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

  const formatDateForTable = (dateStr) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    if (isNaN(date)) return "-";
    return `${String(date.getDate()).padStart(2,"0")}-${String(date.getMonth()+1).padStart(2,"0")}-${date.getFullYear()}`;
  };

 

  return (
    <div className="layout">
      <Sidebar />
      <div className="transaction-container">
        <h2>Transaction List</h2>

        {/* Filters + Create + Download buttons */}
        <div className="transaction-tabs-container mb-4" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div className="filter-container" style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <label>Type:</label>
            <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
              <option value="All">All</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>

            <label>Category:</label>
            <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
              <option value="All">All</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>

            <label>Start:</label>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />

            <label>End:</label>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>

          {/* Buttons */}
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              className="action-btn create"
              onClick={() => navigate("/addtransaction")}
              style={{
                backgroundColor: "#28a745",
                color: "#fff",
                padding: "8px 16px",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Create
            </button>

            <button
              className="action-btn download"
              onClick={handleDownload}
              disabled={downloading || transactions.length === 0}
              style={{
                backgroundColor: "#007bff",
                color: "#fff",
                padding: "8px 16px",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              {downloading ? "Downloading..." : "Download "}
            </button>
          </div>
        </div>

        {/* Transactions table */}
        {loading ? (
          <p>Loading transactions...</p>
        ) : (
          <div className="transaction-table-container">
            <table className="transaction-table">
              <thead>
                <tr>
                  <th>
                    <input type="checkbox" onChange={handleSelectAll} checked={selectedRows.length === transactions.length && transactions.length > 0} />
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
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                      No transactions available
                    </td>
                  </tr>
                ) : (
                  transactions.map((t) => (
                    <tr key={t.id}>
                      <td>
                        <input type="checkbox" checked={selectedRows.includes(t.id)} onChange={() => handleSelectRow(t.id)} />
                      </td>
                      <td>{formatDateForTable(t.date)}</td>
                      <td>{categoryMap[String(t.categoryId)] || "Unknown"}</td>
                      <td><span className={`badge ${t.type?.toLowerCase()}`}>{t.type || "-"}</span></td>
                      <td>₹{t.amount}</td>
                      <td>{t.description || "-"}</td>
                      <td className="flex gap-2">
                        <button className="action-btn edit" onClick={() => handleEdit(t.id)}>Edit</button>
                        <button className="action-btn delete" onClick={() => handleDelete(t.id)}>Delete</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

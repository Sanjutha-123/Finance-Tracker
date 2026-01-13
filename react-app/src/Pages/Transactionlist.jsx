// TransactionList.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getTransactions,
  getCategories,
  deleteTransaction,
  downloadTransactionsCsv,
} from "../Api/auth";
import "../Styles/Transactionlist.css";

export default function TransactionList() {
  const navigate = useNavigate();

  // State
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filterType, setFilterType] = useState("All");
  const [categoryId, setCategoryId] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(10); // Show 10 per page

  const [sortBy, setSortBy] = useState("date");
  const [sortDirection, setSortDirection] = useState("desc");

  // Fetch categories
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

  // Fetch transactions
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const params = {};
        if (filterType !== "All") params.type = filterType.toLowerCase();
        if (categoryId !== "All") params.categoryId = categoryId;
        if (startDate) params.start = formatDateForBackend(startDate);
        if (endDate) params.end = formatDateForBackend(endDate);
        if (startDate) params.startDate = startDate;
        if (endDate) params.endDate = endDate;

        const res = await getTransactions(params);
        const data = res?.data || res || [];

        const txData = (data || []).map((t) => ({
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
        console.error("Failed to fetch transactions", err);
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filterType, categoryId, startDate, endDate]);

  // Format date
  const formatDateForBackend = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const formatDateForTable = (dateStr) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    if (isNaN(date)) return "-";
    return `${String(date.getDate()).padStart(2, "0")}-${String(date.getMonth() + 1).padStart(2, "0")}-${date.getFullYear()}`;
  };

  // CSV download
  const handleDownload = async () => {
    try {
      setDownloading(true);
      const userId = localStorage.getItem("userId");
      const blob = await downloadTransactionsCsv(userId);
      const url = window.URL.createObjectURL(new Blob([blob], { type: "text/csv" }));
      const a = document.createElement("a");
      a.href = url;
      a.download = "transactions.csv";
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert("Download failed");
    } finally {
      setDownloading(false);
    }
  };

  // Row actions
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this transaction?")) return;
    try {
      await deleteTransaction(id);
      setTransactions(transactions.filter((t) => t.id !== id));
      alert("Transaction deleted successfully ");
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
    if (e.target.checked) setSelectedRows(transactions.map((t) => t.id));
    else setSelectedRows([]);
  };

  // Sorting
  const handleSort = (field) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortDirection("asc");
    }
    setPageNumber(1);
  };

  // Map categoryId -> name
  const categoryMap = {};
  categories.forEach((cat) => {
    if (cat?.id != null && cat?.name != null) categoryMap[String(cat.id)] = cat.name;
  });

  // --- Frontend Sorting + Pagination ---
  const sortedTransactions = [...transactions].sort((a, b) => {
    if (sortBy === "amount") return sortDirection === "asc" ? a.amount - b.amount : b.amount - a.amount;
    if (sortBy === "date") return sortDirection === "asc" ? new Date(a.date) - new Date(b.date) : new Date(b.date) - new Date(a.date);
   
    return 0;
  });

  const startIndex = (pageNumber - 1) * pageSize;
  const currentTransactions = sortedTransactions.slice(startIndex, startIndex + pageSize);
  const totalPages = Math.ceil(transactions.length / pageSize);

  return (
    <div className="transaction-container">
      <h2>Transaction List</h2>

      {/* Filters */}
      <div className="transaction-tabs-container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
        <div className="filter-container" style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <label>Type:</label>
          <select value={filterType} onChange={(e) => { setFilterType(e.target.value); setPageNumber(1); }}>
            <option value="All">All</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>

          <label>Category:</label>
          <select value={categoryId} onChange={(e) => { setCategoryId(e.target.value); setPageNumber(1); }}>
            <option value="All">All</option>
            {categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
          </select>

       <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
      <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        
        </div>


        
        

        <div style={{ display: "flex", gap: "10px" }}>
          <button className="action-btn create" onClick={() => navigate("/addtransaction")} style={{ backgroundColor: "#28a745", color: "#fff" }}>Create</button>
          <button className="action-btn download" onClick={handleDownload} disabled={downloading || transactions.length === 0} style={{ backgroundColor: "#007bff", color: "#fff" }}>
            {downloading ? "Downloading..." : "Download"}
          </button>
        </div>
      </div>

      {/* Table */}
      {loading ? <p>Loading...</p> : (
        <div className="transaction-table-container">
          <table className="transaction-table">
            <thead>
              <tr>
                <th><input type="checkbox" onChange={handleSelectAll} checked={selectedRows.length === currentTransactions.length && currentTransactions.length > 0} /></th>
               <th onClick={() => handleSort("date")} style={{ cursor: "pointer" }}>
  Date
  {sortBy === "date" && (
    <span className="sort-arrow">
      {sortDirection === "asc" ? "▲" : "▼"}
    </span>
  )}
</th>
                <th onClick={() => handleSort("categoryId")}>Category </th>
                <th onClick={() => handleSort("type")}>Type </th>
                <th onClick={() => handleSort("amount")} style={{ cursor: "pointer" }}>
  Amount
  {sortBy === "amount" && (
    <span
      className="sort-arrow"
    >
      {sortDirection === "asc" ? "▲" : "▼"}
    </span>
  )}
</th>
                <th>Note</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentTransactions.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign: "center" }}>No transactions available</td></tr>
              ) : currentTransactions.map((t) => (
                <tr key={t.id}>
                  <td><input type="checkbox" checked={selectedRows.includes(t.id)} onChange={() => handleSelectRow(t.id)} /></td>
                  <td>{formatDateForTable(t.date)}</td>
                  <td>{categoryMap[t.categoryId] || "Unknown"}</td>
                  <td>
                    <span style={{
                      padding: "3px 8px",
                      borderRadius: "5px",
                      color: "#fff",
                      backgroundColor: t.type?.toLowerCase() === "income" ? "#28a745" : "#dc3545"
                    }}>{t.type}</span>
                  </td>
                  <td>₹{t.amount}</td>
                  <td>{t.description}</td>
                  <td style={{ display: "flex", gap: "5px" }}>
                    <button onClick={() => handleEdit(t.id)} style={{ backgroundColor: "#ffc107", color: "#fff", border: "none", padding: "4px 8px", borderRadius: "4px" }}>Edit</button>
                    <button onClick={() => handleDelete(t.id)} style={{ backgroundColor: "#dc3545", color: "#fff", border: "none", padding: "4px 8px", borderRadius: "4px" }}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginTop: "15px" }}>
            <button onClick={() => setPageNumber(prev => Math.max(prev - 1, 1))} disabled={pageNumber === 1}>Previous</button>
            <span>Page {pageNumber} of {totalPages}</span>
            <button onClick={() => setPageNumber(prev => Math.min(prev + 1, totalPages))} disabled={pageNumber === totalPages}>Next</button>
          </div>
        </div>
      )}
    </div>
  );
}

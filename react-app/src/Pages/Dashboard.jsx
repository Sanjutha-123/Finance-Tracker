import { useEffect, useState } from "react";
import Sidebar from "../Components/Sidebar";
import { getTransactions, getCategories } from "../Api/auth";
import "../Styles/Dashboard.css";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";

const COLORS = ["#2563eb", "#16a34a", "#dc2626", "#f59e0b", "#7c3aed"];

export default function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const token = localStorage.getItem("token");
      const tx = await getTransactions(token);
      const cat = await getCategories(token);

      console.log("Sample Transaction:", tx?.[0]);

      setTransactions(tx || []);
      setCategories(cat || []);
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= HELPERS ================= */

  const normalizeType = (t) => String(t?.type || "").trim().toLowerCase();

  const getDate = (t) => {
    // Adjusted for your backend: use camelCase datetime if lowercase
    const raw = t.Datetime || t.datetime; 
    if (!raw) return null;
    const date = new Date(raw);
    return isNaN(date.getTime()) ? null : date;
  };

  /* ================= SUMMARY CARDS ================= */

  const totalIncome = transactions
    .filter(t => normalizeType(t) === "income")
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  const totalExpense = transactions
    .filter(t => normalizeType(t) === "expense")
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  const balance = totalIncome - totalExpense;

  /* ================= CATEGORY MAP ================= */

  const categoryMap = {};
  categories.forEach(c => {
    categoryMap[c.id?.toString()] = c.name;
  });

  /* ================= PIE DATA ================= */

  const expenseByCategory = {};
  transactions.forEach(t => {
    if (normalizeType(t) !== "expense") return;

    const category = categoryMap[t.categoryId?.toString()] || "Other";
    expenseByCategory[category] = (expenseByCategory[category] || 0) + Number(t.amount || 0);
  });

  const pieData = Object.entries(expenseByCategory).map(
    ([name, value]) => ({ name, value })
  );

  /* ================= BAR DATA ================= */

  const monthlyExpense = {};
  transactions.forEach(t => {
    if (normalizeType(t) !== "expense") return;

    const date = getDate(t);
    if (!date) return;

    const amount = Number(t.amount);
    if (isNaN(amount)) return;

    const month = date.toLocaleString("en-US", { month: "short" });
    monthlyExpense[month] = (monthlyExpense[month] || 0) + amount;
  });

  const monthOrder = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const barData = monthOrder
    .map(m => ({ month: m, amount: monthlyExpense[m] || 0 }))
    .filter(d => d.amount > 0); // optional: hide months with 0

  /* ================= UI ================= */

  return (
    <div className="layout">
      <Sidebar />

      <div className="content">
        <h1>Dashboard</h1>

        {/* SUMMARY CARDS */}
        <div className="cards">
          <div className="card income">
            <h2>Total Income</h2>
            <p>₹{totalIncome}</p>
          </div>

          <div className="card expense">
            <h2>Total Expense</h2>
            <p>₹{totalExpense}</p>
          </div>

          <div className="card balance">
            <h2>Balance</h2>
            <p>₹{balance}</p>
          </div>
        </div>

        {/* CHARTS */}
        <div className="charts">
          {/* PIE */}
          <div className="chart-card">
            <h4>Category-wise Expense</h4>
            {pieData.length ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" label>
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p>No data</p>
            )}
          </div>

          {/* BAR */}
          <div className="chart-card">
            <h4>Monthly Spending</h4>
            {barData.length ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="amount" fill="#2563eb" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p>No data</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

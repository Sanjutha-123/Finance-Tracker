import React from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Dashboard</h1>
      <p>Welcome! Use the buttons below to manage your finance.</p>

      <div style={{ marginTop: "2rem" }}>
        <button
          style={{ marginRight: "1rem" }}
          onClick={() => navigate("/addtransaction")}
        >
          Add Transaction
        </button>

        <button onClick={() => navigate("/addcategory")}>
          Add Category
        </button>
      </div>
    </div>
  );
};

export default Dashboard;

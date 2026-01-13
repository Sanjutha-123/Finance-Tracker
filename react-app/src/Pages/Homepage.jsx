// Pages/HomePage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/HomePage.css";
import {
  FaWallet,
  FaChartLine,
  FaPlusCircle,
  FaBullseye,
  FaArrowRight
} from "react-icons/fa";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="home">
      {/* Hero Section */}
      <div className="hero">
        <h1>Welcome to Finance Tracker</h1>
        <p>Control your money. Build your future.</p>

        {/* Get Started Button */}
        <button
          className="get-started-btn"
          onClick={() => navigate("/Login")}
        >
          Get Started <FaArrowRight />
        </button>
      </div>

      {/* Action Cards */}
      <div className="action-cards">
        <div className="action-card">
          <FaPlusCircle className="icon" />
          <h3>Add Expense</h3>
          <p>Track every spending easily</p>
        </div>

        <div className="action-card">
          <FaChartLine className="icon" />
          <h3>Reports</h3>
          <p>View income & expense analysis</p>
        </div>

        <div className="action-card">
          <FaWallet className="icon" />
          <h3>Balance</h3>
          <p>Monitor your cash flow</p>
        </div>

        <div className="action-card">
          <FaBullseye className="icon" />
          <h3>Goals</h3>
          <p>Save smarter for the future</p>
        </div>
      </div>

      {/* Quote */}
      <div className="quote-box">
        “A budget is telling your money where to go instead of wondering where it went.”
      </div>
    </div>
  );
}

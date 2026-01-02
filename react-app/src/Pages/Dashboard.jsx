
import "../Styles/dashboard.css";
import Sidebar from "../Components/Sidebar";

export default function Dashboard() {
  const totalIncome = 45000;
  const totalExpense = 28500;
  const balance = totalIncome - totalExpense;

  return (
    <div className="layout">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="content">
        <h2>Dashboard</h2>

        <div className="cards">
          <div className="card income">
            <h4>Total Income</h4>
            <p>₹{totalIncome}</p>
          </div>

          <div className="card expense">
            <h4>Total Expense</h4>
            <p>₹{totalExpense}</p>
          </div>

          <div className="card balance">
            <h4>Monthly Balance</h4>
            <p>₹{balance}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

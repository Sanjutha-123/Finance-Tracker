import { NavLink } from "react-router-dom";
import "../Styles/sidebar.css";

export default function Sidebar() {
  return (
    <div className="sidebar">
      <h2>Finance App</h2>
      <nav>
        <NavLink to="/dashboard" className={({ isActive }) => isActive ? "active" : ""}>
          Home
        </NavLink>
        <NavLink to="/addtransaction" className={({ isActive }) => isActive ? "active" : ""}>
          Add Transaction
        </NavLink>
        <NavLink to="/addcategory" className={({ isActive }) => isActive ? "active" : ""}>
          Add Category
        </NavLink>
        <NavLink to="/transactionlist" className={({ isActive }) => isActive ? "active" : ""}>
          Transaction List
        </NavLink>
      </nav>
    </div>
  );
}

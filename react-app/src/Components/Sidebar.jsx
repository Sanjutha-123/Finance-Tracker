import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaTachometerAlt, FaPlusCircle, FaList, FaTags, FaSignOutAlt, FaSearch,FaHome } from "react-icons/fa";
import "../Styles/sidebar.css";
import { FaUser } from "react-icons/fa";


export default function Sidebar({ profilePhoto }) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const handleLogout = () => navigate("/login");


  
  const menuItems = [

  
    {
      name: "Profile",
      icon: profilePhoto ? (
        <img
          src={profilePhoto}
          alt="Profile"
          className="sidebar-avatar"
          style={{
            width: "35px",
            height: "35px",
            borderRadius: "50%",
            objectFit: "cover",
            border: "2px solid #007bff",
          }}
        />
      ) : (
        <FaUser />
      ),
      path: "/profilepage",
    },
       {name: "Home", icon: <FaHome />, path: "/homepage" },
    { name: "Dashboard", icon: <FaTachometerAlt />, path: "/dashboard" },
    { name: "Add Transaction", icon: <FaPlusCircle />, path: "/addtransaction" },
    { name: "Add Category", icon: <FaTags />, path: "/addcategory" },
    { name: "Transaction List", icon: <FaList />, path: "/transactionlist" },
  ];

  const filteredMenu = menuItems.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="sidebar">
      <div>
        {/* Title */}
        <div className="sidebar-title">

          <span>Finance App</span>
        </div>

        {/* Search Bar */}
        <div className="sidebar-search">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          {filteredMenu.map((item) =>
            item.path ? (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  isActive ? "sidebar-link active" : "sidebar-link"
                }
              >
                <span className="sidebar-icon">{item.icon}</span>
                {item.name}
              </NavLink>
            ) : (
              <div key={item.name} className="sidebar-link no-link">
                <span className="sidebar-icon">{item.icon}</span>
                {item.name}
              </div>
            )
          )}
        </nav>
      </div>

      {/* Logout */}
      <div className="sidebar-logout">
        <button className="logout-btn" onClick={handleLogout}>
          <FaSignOutAlt className="sidebar-icon" /> Logout
        </button>
      </div>
    </div>
  );
}

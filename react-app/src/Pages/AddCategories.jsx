import { useState, useEffect } from "react";
import { getCategories, addCategory } from "../Api/auth";

import "../Styles/Category.css";

export default function AddCategory() {
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [type, setType] = useState("Expense");
  const [filterType, setFilterType] = useState("All");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const data = await getCategories();
    setCategories(data.reverse()); // latest on top
  };

  const handleAddCategory = async () => {
    if (!categoryName.trim()) {
      alert("Category name cannot be empty!");
      return;
    }

    // Check for duplicates
    const duplicate = categories.find(
      (c) =>
        c.name.toLowerCase() === categoryName.toLowerCase() &&
        c.type.toLowerCase() === type.toLowerCase()
    );
    if (duplicate) {
      alert("Category already exists for this type!");
      return;
    }

    const newCategory = await addCategory({ name: categoryName, type });
    setCategories((prev) => [newCategory, ...prev]);
    setCategoryName("");
  };

  const handleDelete = (id) => {
    // Placeholder for delete API
    const confirmed = window.confirm("Are you sure you want to delete this category?");
    if (confirmed) {
      setCategories(categories.filter((c) => c.id !== id));
    }
  };
const filteredCategories = categories.filter((c) => {
  if (filterType === "All") return true;
  return c.type.toLowerCase() === filterType.toLowerCase();
});

  return (
    
      <div className="category-main">
        {/* Add Category Form */}
        <div className="add-category-top">
          <input
            type="text"
            placeholder="Category Name"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
          />
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="Expense">Expense</option>
            <option value="Income">Income</option>
          </select>
          <button onClick={handleAddCategory}>Add Category</button>
        </div>

        {/* Filter */}
        <div className="filter-section">
          <label>Type</label>
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
             <option value="All">All</option>
            <option value="Expense">Expense</option>
            <option value="Income">Income</option>
          </select>
        </div>

        {/* Existing Categories Table */}
        <table className="category-table">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Name</th>
              <th>Type</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCategories.map((cat, index) => (
              <tr key={cat.id || index}>
                <td>{index + 1}</td>
                <td>{cat.name}</td>
                <td>
  <span className={cat.type === "Expense" ? "type-expense" : "type-income"}>
    {cat.type}
  </span>
</td>

                <td>
                  <button className="delete-btn" onClick={() => handleDelete(cat.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {filteredCategories.length === 0 && (
              <tr>
                <td colSpan="4" style={{ textAlign: "center" }}>
                  No categories found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
   
  );
}

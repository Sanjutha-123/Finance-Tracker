import { useState } from "react";
import { addCategory } from "../Api/auth";
import "../TransactionCategory.css";

const AddCategory = () => {
  const [name, setName] = useState("");
  const [type, setType] = useState("Expense");

  const handleSubmit = async (e) => {
    e.preventDefault(); // prevent page reload if button is inside form
    if (!name) {
      alert("Please enter a category name");
      return;
    }

    try {
      // Normalize type: first letter uppercase, rest lowercase
      const formattedType = type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();

      const result = await addCategory({ name, type: formattedType });
      alert("Category Added Successfully");
      console.log("Category added:", result);

      setName(""); // reset form
      setType("Expense"); // reset type to default
    } catch (error) {
  console.error("Failed to add category:", error.response?.data || error.message || error);
}

  };

  return (
    <div className="card">
      <h2>Add Category</h2>

      <label>Category Name</label>
      <input
        type="text"
        placeholder="Entertainment"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <label>Type</label>
      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option>Expense</option>
        <option>Income</option>
      </select>

     <button className="btn-primary" onClick={handleSubmit}>
  Add Category
</button>
    </div>
  );
};

export default AddCategory;

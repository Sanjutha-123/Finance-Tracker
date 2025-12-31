import React, { useEffect, useState } from "react";
import api from "./api"; // import axios instance

const AddTransaction = () => {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    amount: "",
    type: "income",
    categoryId: "",
    description: "",
  });
  const [message, setMessage] = useState("");

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/category/list");
        setCategories(res.data);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.amount || !formData.categoryId) {
      setMessage("Amount and Category are required.");
      return;
    }

    try {
      await api.post("/transaction/add", {
        amount: parseFloat(formData.amount),
        type: formData.type,
        categoryId: parseInt(formData.categoryId),
        description: formData.description,
      });
      setMessage("Transaction added successfully!");
      setFormData({
        amount: "",
        type: "income",
        categoryId: "",
        description: "",
      });
    } catch (err) {
      console.error(err);
      setMessage("Error adding transaction.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Add Transaction</h2>
      {message && <p className="mb-4 text-green-600">{message}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label>Amount</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label>Type</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>

        <div>
          <label>Category</label>
          <select
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="">Select category</option>
            {categories
              .filter((c) => c.type.toLowerCase() === formData.type)
              .map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
          </select>
        </div>

        <div>
          <label>Description</label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Transaction
        </button>
      </form>
    </div>
  );
};

export default AddTransaction;

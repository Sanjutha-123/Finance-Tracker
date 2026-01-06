import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import { addCategory, getCategories } from "../Api/auth"; 
import "../Styles/TransactionCategory.css";
import Sidebar from "../Components/Sidebar";

const AddCategory = () => {
    const navigate = useNavigate(); 

    const [name, setName] = useState("");
    const [type, setType] = useState("Expense");
    const [existingCategories, setExistingCategories] = useState([]);

    // Fetch categories whenever name or type changes
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const result = await getCategories();
                setExistingCategories(result);
            } catch (error) {
                console.error("Failed to fetch categories:", error);
            }
        };
        fetchCategories();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const trimmedName = name.trim();
        if (!trimmedName) {
            alert("Please enter a category name");
            return;
        }

        // Check duplicate (case-insensitive)
        const isDuplicate = existingCategories.some(
            (cat) =>
                cat.name.toLowerCase() === trimmedName.toLowerCase() &&
                cat.type.toLowerCase() === type.toLowerCase()
        );

        if (isDuplicate) {
            alert(`Category "${trimmedName} - ${type}" already exists!`);
            return;
        }

        try {
            const formattedType = type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
            const result = await addCategory({ name: trimmedName, type: formattedType });

            alert("Category Added Successfully");
            navigate("/addtransaction"); 
            console.log("Category added:", result);

            setName("");
            setType("Expense");

            // Immediately update local categories list
            setExistingCategories([...existingCategories, { name: trimmedName, type: formattedType }]);
        } catch (error) {
            console.error("Failed to add category:", error.response?.data || error.message || error);
        }
    };

    return (
        <div className="layout">
            <Sidebar />
            <div className="page-wrapper">
                <div className="card">
                    <h2>Add Category</h2>

                    <label>Category Name</label>
                    <input
                        type="text"
                        placeholder="Category Name"
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
            </div>  
        </div> 
    );
};

export default AddCategory;

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import Dashboard from "./Pages/Dashboard";
import AddCategory from "./Pages/AddCategories";
import Transactionlist from "./Pages/Transactionlist";
import ErrorBoundary from "./ErrorBoundary";
import AddTransaction from "./Pages/AddTransaction";
import EditTransaction from "./Pages/EditTransaction";

function App() {
  return (
    <Router>
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/addCategory" element={<AddCategory />} />
          <Route path="/transactionlist" element={<Transactionlist />} />
          <Route path="/addtransaction"  element={<AddTransaction/>}/>
          <Route path="/edittransaction/:id" element={<EditTransaction />} />

        </Routes>
      </ErrorBoundary>
    </Router>
  );
}

export default App;
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import Dashboard from "./Pages/Dashboard";
import AddCategory from "./Pages/AddCategories";
import Transactionlist from "./Pages/Transactionlist";
import ErrorBoundary from "./ErrorBoundary";
import AddTransaction from "./Pages/AddTransaction";
import EditTransaction from "./Pages/EditTransaction";
import Profilepage from "./Pages/Profilepage";
import Layout from "./Components/Layout";
import HomePage from "./Pages/HomePage";

function App() {
  return (
    <Router>
      <ErrorBoundary>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
         <Route path="/homepage" element={<HomePage />} />

          <Route
            path="/dashboard"
            element={
              <Layout>
                <Dashboard />
              </Layout>
            }
          />
          <Route
            path="/addCategory"
            element={
              <Layout>
                <AddCategory />
              </Layout>
            }
          />
          <Route
            path="/transactionlist"
            element={
              <Layout>
                <Transactionlist />
              </Layout>
            }
          />
          <Route
            path="/addtransaction"
            element={
              <Layout>
                <AddTransaction />
              </Layout>
            }
          />
          <Route
            path="/edittransaction/:id"
            element={
              <Layout>
                <EditTransaction />
              </Layout>
            }
          />
          <Route
            path="/profilepage"
            element={
              <Layout>
                <Profilepage />
              </Layout>
            }
          />
        </Routes>
      </ErrorBoundary>
    </Router>
  );
}

export default App;

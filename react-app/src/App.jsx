import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import Dashboard from "./Pages/Dashboard";

import AddTransaction from "./Pages/AddTransaction"



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login/>}/>
  
        <Route path ="/addTransaction" element={<AddTransaction/>}/>
 
  
    </Routes>
    </Router>
  );
}

export default App;

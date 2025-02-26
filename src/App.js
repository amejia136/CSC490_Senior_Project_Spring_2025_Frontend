import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./Components/Home/Home";
import Login from "./Components/Login/Login";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} /> {/* Login page */}
                <Route path="/home" element={<Home />} /> {/* Home page */}
            </Routes>
        </Router>
    );
}

export default App;

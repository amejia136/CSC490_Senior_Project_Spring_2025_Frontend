import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./Components/Home/Home";
import Login from "./Components/Login/Login";


import AppProfile from "./Components/Profile/Profile";


function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<AppProfile />} />
            </Routes>
        </Router>
    );
}

export default App;

import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import './App.css'
import Navbar from "./Components/Navbar/Navbar";
import Home from "./Components/Home/Home";
import Main from "./Components/Main/Main";
import Footer from "./Components/Footer/Footer";
import Login from "./Components/Login/Login";


const App = () => {
    return (
        <Router>
            <Routes>
                {/* Login Page */}
                <Route path="/" element={
                    <>
                        <Login />
                    </>
                } />
                {/* Home Page */}
                <Route path="/home" element={
                    <>
                        <Navbar />
                        <Home />
                        <Main />
                        <Footer />
                    </>
                } />
            </Routes>
        </Router>
    );
};

export default App;

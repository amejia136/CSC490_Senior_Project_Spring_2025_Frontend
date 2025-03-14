import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import './App.css'
import Navbar from "./Components/Navbar/Navbar";
import Home from "./Components/Home/Home";
import Main from "./Components/Main/Main";
import Footer from "./Components/Footer/Footer";
import Login from "./Components/Login/Login";
import Profile from "./Components/Profile/Profile";
import Achievements from "./Components/Achievements/Achievements";

const App = () => {
    return (
        <Router>
            <Routes>

                {/* Login Page */}
                <Route path="/login" element={
                    <>
                        <Login />
                    </>
                } />

                {/* Home Page */}
                <Route path="/" element={
                    <>
                        <Navbar />
                        <Home />
                        <Main />
                        <Footer />
                    </>
                } />

                {/* Profile Page */}
                <Route path="/profile" element={
                    <>
                        <Navbar />
                        <Profile />
                    </>
                } />
                {/* Achievements Page */}
                <Route path="/achievements" element={
                    <>
                        <Navbar />
                        <Achievements />
                    </>
                } />
            </Routes>
        </Router>
    );
};

export default App;
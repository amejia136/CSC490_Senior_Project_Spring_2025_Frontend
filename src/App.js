import React from "react";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import './App.css'
import Navbar from "./Components/Navbar/Navbar";
import Home from "./Components/Home/Home";
import Main from "./Components/Main/Main";
import Footer from "./Components/Footer/Footer";
import Login from "./Components/Login/Login";
import Profile from "./Components/Profile/Profile";
import Achievements from "./Components/Achievements/Achievements";
import Itinerary from "./Components/Itinerary/Itinerary";
import ResetPassword from "./Components/Login/ResetPassword";
import AccountSecurity from "./Components/Profile/AccountSecurity";
import {UserProvider} from './UserContext';
import VerifyEmailLink from "./Components/Profile/VerifyEmailLink";
import About from "./Components/About/About";
import Contact from "./Components/Contact/Contact";


const App = () => {
    return (
        <UserProvider>
            <Router>
                <Routes>

                    {/* Login Page */}
                    <Route path="/login" element={
                        <>
                            <Login/>
                        </>
                    }/>

                    {/* Home Page */}
                    <Route path="/" element={
                        <>
                            <Navbar/>
                            <Home/>
                            <Main/>
                            <Footer/>
                        </>
                    }/>

                    {/* Profile Page */}
                    <Route path="/profile" element={
                        <>
                            <Navbar/>
                            <Profile/>
                        </>
                    }/>
                    {/* Achievements Page */}
                    <Route path="/achievements" element={
                        <>
                            <Navbar/>
                            <Achievements/>
                        </>
                    }/>

                    {/* Itinerary Page */}
                    <Route path="/itinerary" element={
                        <>
                            <Navbar/>
                            <Itinerary/> {/* Display Itinerary component */}
                        </>
                    }/>

                    {/* About Page */}
                    <Route path="/about" element={
                        <>
                            <Navbar/>
                            <About/>
                            <Footer/>
                        </>
                    }/>

                    {/* About Page */}
                    <Route path="/contact" element={
                        <>
                            <Navbar/>
                            <Contact/>
                            <Footer/>
                        </>
                    }/>

                    {/* Reset Password Page */}
                    <Route path="/reset-password" element={
                        <ResetPassword/>
                    }/>

                    {/* Account Security Page */}
                    <Route path="/account-security" element={
                        <>
                            <Navbar/>
                            <AccountSecurity/>
                        </>
                    }/>

                    {/* Verify Email Page */}
                    <Route path="/verify-link" element={
                        <>
                            <VerifyEmailLink/>
                        </>
                    }/>

                </Routes>
            </Router>
        </UserProvider>
    );
};

export default App;
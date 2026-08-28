import React from "react";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import {LoadScript} from "@react-google-maps/api";
import {UserProvider} from './UserContext';
import {DarkModeProvider} from './Components/DarkMode/DarkMode';

import './App.css';
import Navbar from "./Components/Navbar/Navbar";
import Home from "./Components/Home/Home";
import Main from "./Components/Main/Main";
import Footer from "./Components/Footer/Footer";
import Login from "./Components/Login/Login";
import Profile from "./Components/Profile/Profile";
import Achievements from "./Components/Achievements/Achievements";
import GoogleMapComponent from "./Components/GoogleMap/GoogleMap";
import Itinerary from "./Components/Itinerary/Itinerary";
import ItineraryDetailPage from "./Components/ItineraryDetailPage/ItineraryDetailPage";
import ResetPassword from "./Components/Login/ResetPassword";
import AccountSecurity from "./Components/Profile/AccountSecurity";
import VerifyEmailLink from "./Components/Profile/VerifyEmailLink";
import About from "./Components/About/About";
import Contact from "./Components/Contact/Contact";
import {LanguageProvider} from "./LanguageContext";
import DetailPage from "./Components/Details/Details";

const App = () => {
    return (
        <UserProvider>
            <LanguageProvider>
                <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY} libraries={["places"]}>
                    <DarkModeProvider>
                        <Router>
                            <Routes>
                                {/* Login Page */}
                                <Route path="/login" element={<Login/>}/>

                                {/* Home Page */}
                                <Route path="/" element={
                                    <>
                                        <Navbar/>
                                        <Home/>
                                        <Main/>
                                        <Footer/>
                                    </>
                                }/>
                                {/* Detail Page */}
                                <Route path="/details" element={
                                    <>
                                        <Navbar/>
                                        <DetailPage/>
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

                                {/* Itinerary List Page */}
                                <Route path="/itinerary" element={
                                    <>
                                        <Navbar/>
                                        <Itinerary/>
                                    </>
                                }/>

                                {/* Itinerary Detail Page */}
                                <Route path="/itinerary/:itineraryId" element={
                                    <>
                                        <Navbar/>
                                        <ItineraryDetailPage/>
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

                                {/* Contact Page */}
                                <Route path="/contact" element={
                                    <>
                                        <Navbar/>
                                        <Contact/>
                                        <Footer/>
                                    </>
                                }/>

                                {/* Reset Password Page */}
                                <Route path="/reset-password" element={<ResetPassword/>}/>

                                {/* Account Security Page */}
                                <Route path="/account-security" element={
                                    <>
                                        <Navbar/>
                                        <AccountSecurity/>
                                    </>
                                }/>

                                {/* Verify Email Link Page */}
                                <Route path="/verify-link" element={<VerifyEmailLink/>}/>

                                {/* Google Map Page */}
                                <Route path="/map" element={
                                    <>
                                        <Navbar/>
                                        <GoogleMapComponent/>
                                        <Footer/>
                                    </>
                                }/>

                            </Routes>
                        </Router>
                    </DarkModeProvider>
                </LoadScript>
            </LanguageProvider>
        </UserProvider>
    );
};

export default App;


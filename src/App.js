import React from "react";
import {BrowserRouter, BrowserRouter as Router, Route, Routes} from "react-router-dom";
import './App.css'
import Navbar from "./Components/Navbar/Navbar";
import Home from "./Components/Home/Home";
import Main from "./Components/Main/Main";
import Footer from "./Components/Footer/Footer";
//import Login from "./Components/Login/Login";
import Profile from "./Components/Profile/Profile";
//import AchievementsPage from './Components/Achievements/achievements.Page';


const App = () => {
    return (
        <>
            <BrowserRouter> {/* Wrap your app in BrowserRouter */}
                <Navbar />
                <Profile />
            </BrowserRouter>
   </>
    );
};

export default App;

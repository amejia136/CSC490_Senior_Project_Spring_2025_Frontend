import React from "react";
//import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
//import Home from "./Components/Home/Home";
//import Login from "./Components/Login/Login";
import './App.css'
import Navbar from "./Components/Navbar/Navbar";
import Home from "./Components/Home/Home";
import Main from "./Components/Main/Main";
import Footer from "./Components/Footer/Footer";


const App = () => {
    return (
        <>
            <Navbar/>
            <Home/>
            <Main/>
            <Footer/>
        </>
    )
}

export default App;

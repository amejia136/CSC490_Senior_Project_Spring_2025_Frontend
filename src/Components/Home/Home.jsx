import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css"; // Import CSS file for styling

const Home = () => {

    // Initialize navigate function * Navigation Purposes *
    const navigate = useNavigate();


    // Function to handle sign out
    const handleSignOut = () => {
        localStorage.removeItem("user"); // Remove user from storage
        navigate("/"); // Redirect to Login page * Navigation Purposes *
    };

    return (
        <div>
            <h1>Welcome to the Home Page</h1>
            <button onClick={handleSignOut}>Sign Out</button>
        </div>
    );
};

export default Home;

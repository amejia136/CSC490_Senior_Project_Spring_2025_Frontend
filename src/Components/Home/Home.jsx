import React, {useEffect} from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css"; // Import CSS file for styling

const Home = () => {

    // Initialize navigate function * Navigation Purposes *
    const navigate = useNavigate();

    // Checks for user info saved in local or session, stays on Home page
    useEffect(() => {
        const savedUser = localStorage.getItem("user") || sessionStorage.getItem("user");

        // If savedUser is empty, user is not logged in
        if (!savedUser) {
            navigate("/"); // Redirects to them to Login page
        }
    }, [navigate]);


    // Function to handle sign out
    const handleSignOut = () => {
        localStorage.removeItem("user");
        sessionStorage.removeItem("user");
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

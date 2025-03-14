import React, {useState} from "react"; // Import React
import axios from "axios"; // Import axios to make API requests to Flask (backend)
import "./Login.css"; //Import the CSS file for styling
import {FaEnvelope, FaUser,} from "react-icons/fa"; // Import icons for input fields
import {RiLockPasswordFill} from "react-icons/ri"; // Import password icon
import {useNavigate} from "react-router-dom";

const Login = () => {

    // For live hosting uncomment this
    // const API_BASE_URL = "https://amejia201.pythonanywhere.com";

    // Initialize navigate function * Navigation Purposes *
    const navigate = useNavigate();

    //State to track the active form (Login or Register)
    const [action, setAction] = useState('');

    //State to track if user checked remember me box or not
    const [rememberMe, setRememberMe] = useState(false);


    // State for handling registration form data
    const [registerData, setRegisterData] = useState({
        username: "",
        email: "",
        password: "",
    });

    // State for handling login form data
    const [loginData, setLoginData] = useState({
        email: "",
        password: ""
    });

    // State for displaying error and success messages
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    // Function to handle input changes for registration form
    const handleInputChange = (e) => {
        setRegisterData({...registerData, [e.target.name]: e.target.value});
    };

    // Function to handle input changes for login form
    const handleLoginChange = (e) => {
        setLoginData({...loginData, [e.target.name]: e.target.value});
    };

    // Function to handle registration form submission
    const handleRegister = async (e) => {
        e.preventDefault(); // Prevents page refresh
        setErrorMessage("");
        setSuccessMessage("");

        try {
            // Uses backend API to register a user
            // const response = await axios.post(`${API_BASE_URL}/signup` *** for live hosting has backend uncomment this

            // Local hosting, must run PyCharm backend at the same time on the same computer
            const response = await axios.post("http://127.0.0.1:5000/auth/signup", registerData, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            setSuccessMessage(response.data.message); // Shows success message on frontend
            console.log("User registered:", response.data);

            // Clear form fields after successful registration
            setRegisterData({username: "", email: "", password: ""});

            // Handles errors from the API response
        } catch (error) {
            if (error.response) {
                setErrorMessage(error.response.data.error);
            } else {
                setErrorMessage("Something went wrong. Please try again.");
            }
        }
    };


    // Function to handle login form submission
    const handleLogin = async (e) => {
        e.preventDefault(); // Prevents page reload on form submission
        setErrorMessage(""); // Reset error message
        setSuccessMessage(""); // Reset success message

        try {
            // Uses backend API to authenticate user login
            // const response = await axios.post(`${API_BASE_URL}/login` ** for live hosting, has backend *** for live hosting uncomment this

            // Local hosting, must run PyCharm backend at the same time on the same computer
            const response = await axios.post("http://127.0.0.1:5000/auth/login", loginData, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            setSuccessMessage("Login successful!"); // Shows success message
            console.log("User logged in:", response.data);

            if (rememberMe) {
                // If box checked, stores user session in localStorage (Stays logged in)
                localStorage.setItem("user", JSON.stringify(response.data.user));
            } else {
                // if box not checked, store user session in sessionStorage (Clears logged in user when browser closes)
                sessionStorage.setItem("user", JSON.stringify(response.data.user));
            }

            // Redirect or update UI upon successful login
            setTimeout(() => {
                navigate("/") // Redirect to dashboard or homepage
            }, 2000);

            // Handle errors from the API response
        } catch (error) {
            if (error.response) {
                setErrorMessage(error.response.data.error);
            } else {
                setErrorMessage("Something went wrong. Please try again.");
            }
        }
    };

    // Function to switch to Register form
    const registerLink = () => {
        setAction(' active');
    };

    // Function to switch to Login form
    const loginLink = () => {
        setAction('')
    };


    return (
        <div className={"login-container"}>
            <div className={`wrapper${action}`}>
                {/* ----------------------------- Login Form ----------------------------- */}
                <div className="form-box login">
                    <form
                        onSubmit={handleLogin}> {/* When submitted, calls handleLogin, sends API request to backend */}
                        <h1>Login</h1>
                        <div className="input-box">
                            <input type="email"
                                   name="email" // Backend uses field as "email". If changed, change backend API request
                                   placeholder='Email'
                                   value={loginData.email} // Pulls data from state, is sent to login backend
                                   onChange={handleLoginChange} // Updates the state, is sent to backend
                                   required/>
                            <FaUser className='icon'/>

                        </div>
                        <div className="input-box">
                            <input
                                type="password"
                                name="password" // Backend expects this as "password". If changed, change backend API request
                                placeholder="Password"
                                value={loginData.password} // Pulls password from state, is sent to login backend
                                onChange={handleLoginChange} // Updates password state, is sent to backend
                                required
                            />
                            <RiLockPasswordFill className='icon'/>
                        </div>


                        <div className="remember-forgot">
                            <label><input type="checkbox"
                                          checked={rememberMe}
                                          onChange={() => setRememberMe(!rememberMe)}
                            />Remember me </label>
                            <a href="#">Forgot password?</a>
                        </div>


                        <button type="submit">Login</button>
                        {/*Login request is sent to backend*/}

                        <div className="register-link">
                            <p>Don't have an account? <a href="#" onClick={registerLink}>Register</a></p>
                        </div>
                    </form>

                    {/*Message box for errors and success messages*/}
                    <div className="message-box">
                        {errorMessage &&
                            <p className="error">{errorMessage}</p>} {/* Displays backend error messages if login fail */}
                        {successMessage &&
                            <p className="success">{successMessage}</p>} {/* Displays success message from backend if login is successful */}
                    </div>
                </div>

                {/* ----------------------------- Registration Form ----------------------------- */}
                <div className="form-box register">
                    <form
                        onSubmit={handleRegister}> {/* When submitted, calls handleRegister, sends API request to backend to register user */}
                        <h1>Registration</h1>
                        <div className="input-box">
                            <input type="text"
                                   name="username" // Backend expects this as "username". If changed, change backend API request
                                   placeholder="Username"
                                   value={registerData.username} // Pulls username from state, is sent to register new user backend
                                   onChange={handleInputChange} // Updates username state, is sent to backend
                                   required/>
                            <FaUser className='icon'/>
                        </div>
                        <div className="input-box">
                            <input type="email"
                                   name="email" // Backend expects this as "email". If changed, change backend API request
                                   placeholder="Email"
                                   value={registerData.email} // Pulls email from state, is sent to register new user backend
                                   onChange={handleInputChange} // Updates email state, is sent to backend
                                   required/>
                            <FaEnvelope className='icon'/>
                        </div>
                        <div className="input-box">
                            <input type="password"
                                   name="password" // Backend expects this as "password". If changed, change backend API request
                                   placeholder="Password"
                                   value={registerData.password} // Pulls password from state, is sent to register new user backend
                                   onChange={handleInputChange} // Updates password state, is sent to backend
                                   required/>
                            <RiLockPasswordFill className='icon'/>

                        </div>

                        <div className="remember-forgot">
                            <label><input type="checkbox"/>I agree to the terms & conditions </label>
                        </div>

                        <button type="submit">Register</button>
                        {/* Signup request is sent to backend */}

                        <div className="register-link">
                            <p>Already have an account? <a href="#" onClick={loginLink}>Login</a></p>
                        </div>
                    </form>

                    {/* Message box for errors and success messages */}
                    <div className="message-box">
                        {errorMessage &&
                            <p className="error">{errorMessage}</p>} {/* Displays backend error messages if registration fail */}
                        {successMessage &&
                            <p className="success">{successMessage}</p>} {/* Displays success message from backend if registration is successful */}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Login;
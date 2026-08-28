import React, {useState} from "react";
import axios from "axios";
import "./Login.css";
import {FaEnvelope, FaUser} from "react-icons/fa";
import {RiLockPasswordFill} from "react-icons/ri";
import {useLocation, useNavigate} from "react-router-dom";
import {getAuth, sendPasswordResetEmail} from "firebase/auth";
import app, {db} from "../../firebaseConfig";
import {auth} from "../../firebaseConfig";
import {useContext} from 'react';
import {UserContext} from '../../UserContext';
import {signInWithEmailAndPassword} from "firebase/auth";
import {LanguageContext} from "../../LanguageContext";
import i18n from "../../Translations/i18n";
import {doc, getDoc} from "firebase/firestore";

const Login = () => {
    const {setUser} = useContext(UserContext);
    const {setLanguage} = useContext(LanguageContext);
    const navigate = useNavigate();
    const [action, setAction] = useState('');
    const location = useLocation();
    const [rememberMe, setRememberMe] = useState(false);
    const [loginStage, setLoginStage] = useState("login");
    const [tempUID, setTempUID] = useState("");
    const [code, setCode] = useState("");
    const [registerData, setRegisterData] = useState({
        username: "",
        email: "",
        password: "",
    });
    const [loginData, setLoginData] = useState({
        email: "",
        password: ""
    });
    const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
    const [isForgotPassword, setIsForgotPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [acceptedTerms, setAcceptedTerms] = useState(false);

    React.useEffect(() => {
        if (location.state && location.state.showRegister) {
            setAction(' active');
        }
    }, [location]);

    const handleInputChange = (e) => {
        setRegisterData({...registerData, [e.target.name]: e.target.value});
    };

    const handleLoginChange = (e) => {
        setLoginData({...loginData, [e.target.name]: e.target.value});
    };

    const handleForgotPasswordChange = (e) => {
        setForgotPasswordEmail(e.target.value);
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setErrorMessage("");
        setSuccessMessage("");

        if (!acceptedTerms) {
            setErrorMessage("You must accept the terms & conditions to register");
            return;
        }

        try {
            const response = await axios.post("http://127.0.0.1:5000/auth/signup", registerData, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            setSuccessMessage(response.data.message);
            console.log("User registered:", response.data);
            setRegisterData({username: "", email: "", password: ""});
            setAcceptedTerms(false);
        } catch (error) {
            if (error.response) {
                setErrorMessage(error.response.data.error);
            } else {
                setErrorMessage("Something went wrong. Please try again.");
            }
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setErrorMessage("");
        setSuccessMessage("");

        try {
            const response = await axios.post("http://127.0.0.1:5000/auth/login", loginData, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.data?.["2fa_required"]) {
                setTempUID(response.data.uid);
                setLoginStage("2fa");
                return;
            }

            setSuccessMessage("Login successful!");
            console.log("User logged in:", response.data);

            await signInWithEmailAndPassword(auth, loginData.email, loginData.password);

            const user = response.data.user;
            const userId = user.id || user.uid;

            setUser(user);

            if (rememberMe) {
                localStorage.setItem("user", JSON.stringify(user));
                localStorage.setItem("userId", userId);
            } else {
                sessionStorage.setItem("user", JSON.stringify(user));
                sessionStorage.setItem("userId", userId);
            }

            const userRef = doc(db, "Users", userId);
            const userSnap = await getDoc(userRef);

            if (userSnap.exists()) {
                const userData = userSnap.data();
                const language = userData.Language || "English";
                const languageMap = {"English": "en", "Spanish": "es"};
                const languageCode = languageMap[language] || "en";
                i18n.changeLanguage(languageCode);
                setLanguage(languageCode);
                localStorage.setItem('appLanguage', languageCode);
                sessionStorage.setItem('appLanguage', languageCode);
            } else {
                console.error("User profile not found for language setting.");
            }

            setTimeout(() => {
                navigate("/");
                window.location.reload();
            }, 1000);
        } catch (error) {
            if (error.response) {
                setErrorMessage(error.response.data.error);
            } else {
                setErrorMessage("Something went wrong. Please try again.");
            }
        }
    };

    const handleVerifyCode = async (e) => {
        e.preventDefault();
        setErrorMessage("");
        setSuccessMessage("");

        try {
            const response = await axios.post("http://127.0.0.1:5000/2fa/verify-login-code", {
                uid: tempUID,
                code: code,
            });

            const user = response.data.user;
            setUser(user);

            if (rememberMe) {
                localStorage.setItem("user", JSON.stringify(user));
                localStorage.setItem("userId", user.uid);
            } else {
                sessionStorage.setItem("user", JSON.stringify(user));
                sessionStorage.setItem("userId", user.uid);
            }

            setSuccessMessage("Two factor authentication verified. Logging in...");
            setTimeout(() => {
                navigate("/");
                window.location.reload();
            }, 1000);
        } catch (error) {
            if (error.response) {
                setErrorMessage(error.response.data.error);
            } else {
                setErrorMessage("Verification failed. Try again.");
            }
        }
    };

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        setErrorMessage("");
        setSuccessMessage("");

        try {
            await sendPasswordResetEmail(auth, forgotPasswordEmail, {
                url: "http://localhost:3000/reset-password"
            });
            setSuccessMessage("Password reset link sent to your email.");
        } catch (error) {
            console.error("Error sending password reset email:", error);
            setErrorMessage("Failed to send password reset email. Please try again.");
        }
    };

    const switchToForgotPassword = () => {
        setIsForgotPassword(true);
    };

    const switchToLogin = () => {
        setIsForgotPassword(false);
    };

    const registerLink = () => {
        setAction(' active');
    };

    const loginLink = () => {
        setAction('')
    };

    return (
        <div className={"login-container"}>
            <div className={`wrapper${action}`}>
                {loginStage === "2fa" ? (
                    <div className="form-box login">
                        <form onSubmit={handleVerifyCode}>
                            <h1>Two-Factor Authentication Verification</h1>
                            <p>We sent a 4-digit code to your email.</p>
                            <div className="input-box">
                                <input
                                    type="text"
                                    placeholder="Enter 4-digit code"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    required
                                />
                            </div>
                            <button type="submit">Verify</button>
                        </form>
                        <div className="message-box">
                            {errorMessage && <p className="error">{errorMessage}</p>}
                            {successMessage && <p className="success">{successMessage}</p>}
                        </div>
                    </div>
                ) : (
                    <>
                        {!isForgotPassword ? (
                            <div className="form-box login">
                                <form onSubmit={handleLogin}>
                                    <h1>Login</h1>
                                    <div className="input-box">
                                        <input type="email"
                                               name="email"
                                               placeholder='Email'
                                               value={loginData.email}
                                               onChange={handleLoginChange}
                                               required/>
                                        <FaUser className='icon'/>
                                    </div>
                                    <div className="input-box">
                                        <input
                                            type="password"
                                            name="password"
                                            placeholder="Password"
                                            value={loginData.password}
                                            onChange={handleLoginChange}
                                            required
                                        />
                                        <RiLockPasswordFill className='icon'/>
                                    </div>
                                    <div className="remember-forgot">
                                        <label><input type="checkbox"
                                                      checked={rememberMe}
                                                      onChange={() => setRememberMe(!rememberMe)}
                                        />Remember me </label>
                                        <a href="#" onClick={switchToForgotPassword}>Forgot password?</a>
                                    </div>
                                    <button type="submit">Login</button>
                                    <div className="register-link">
                                        <p>Don't have an account? <a href="#" onClick={registerLink}>Register</a></p>
                                    </div>
                                </form>
                                <div className="message-box">
                                    {errorMessage && <p className="error">{errorMessage}</p>}
                                    {successMessage && <p className="success">{successMessage}</p>}
                                </div>
                            </div>
                        ) : (
                            <div className="form-box forgot-password">
                                <form onSubmit={handleForgotPassword}>
                                    <h1>Trouble logging in?</h1>
                                    <p>Enter your email and we'll send you a link to reset your password.</p>
                                    <div className="input-box">
                                        <input
                                            type="email"
                                            placeholder="Email"
                                            value={forgotPasswordEmail}
                                            onChange={handleForgotPasswordChange}
                                            required
                                        />
                                        <FaEnvelope className="icon"/>
                                    </div>
                                    <button type="submit">Send Reset Link</button>
                                    <div className="register-link">
                                        <p><a href="#" onClick={switchToLogin}>Back to login</a></p>
                                    </div>
                                </form>
                                <div className="message-box">
                                    {errorMessage && <p className="error">{errorMessage}</p>}
                                    {successMessage && <p className="success">{successMessage}</p>}
                                </div>
                            </div>
                        )}

                        <div className="form-box register">
                            <form onSubmit={handleRegister}>
                                <h1>Registration</h1>
                                <div className="input-box">
                                    <input type="text"
                                           name="username"
                                           placeholder="Username"
                                           value={registerData.username}
                                           onChange={handleInputChange}
                                           required/>
                                    <FaUser className='icon'/>
                                </div>
                                <div className="input-box">
                                    <input type="email"
                                           name="email"
                                           placeholder="Email"
                                           value={registerData.email}
                                           onChange={handleInputChange}
                                           required/>
                                    <FaEnvelope className='icon'/>
                                </div>
                                <div className="input-box">
                                    <input type="password"
                                           name="password"
                                           placeholder="Password"
                                           value={registerData.password}
                                           onChange={handleInputChange}
                                           required/>
                                    <RiLockPasswordFill className='icon'/>
                                </div>
                                <div className="remember-forgot">
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={acceptedTerms}
                                            onChange={() => setAcceptedTerms(!acceptedTerms)}
                                            required
                                        />
                                        I agree to the terms & conditions
                                    </label>
                                </div>
                                <button type="submit">Register</button>
                                <div className="register-link">
                                    <p>Already have an account? <a href="#" onClick={loginLink}>Login</a></p>
                                </div>
                            </form>
                            <div className="message-box">
                                {errorMessage && <p className="error">{errorMessage}</p>}
                                {successMessage && <p className="success">{successMessage}</p>}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Login;
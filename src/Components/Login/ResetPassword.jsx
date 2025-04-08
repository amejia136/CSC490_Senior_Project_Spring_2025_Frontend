import React, { useState, useEffect } from "react";
import "./Login.css";
import { RiLockPasswordFill } from "react-icons/ri";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getAuth, verifyPasswordResetCode, confirmPasswordReset, onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebaseConfig";

const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [email, setEmail] = useState(""); // ✅ Store email after verifying oobCode
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();


    useEffect(() => {
        const oobCode = searchParams.get("oobCode");

        if (oobCode) {
            verifyPasswordResetCode(auth, oobCode)
                .then((email) => {
                    console.log("Email extracted from reset code:", email);
                    setEmail(email);
                })
                .catch((error) => {
                    console.error("Invalid or expired reset code:", error);
                    setErrorMessage("Invalid or expired link.");
                });
        } else {
            setErrorMessage("Invalid reset link.");
        }
    }, [searchParams]);

    const handleNewPasswordChange = (e) => {
        setNewPassword(e.target.value);
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setErrorMessage("");
        setSuccessMessage("");

        const oobCode = searchParams.get("oobCode");

        if (!oobCode) {
            setErrorMessage("Invalid or expired link.");
            return;
        }

        if (!email) {
            setErrorMessage("Email not found. Please try again.");
            return;
        }

        try {

            await confirmPasswordReset(auth, oobCode, newPassword);
            setSuccessMessage("Password reset successfully. Redirecting to login...");

            console.log(`Reset password for email: ${email}`);


            await axios.post("http://127.0.0.1:5000/auth/update-password", {
                email: email, // ✅ Now you have the email!
                newPassword: newPassword, // ✅ Send new password to backend
            });

            console.log("Password updated in Firestore");
            
            setTimeout(() => {
                navigate("/login");
            }, 2000);

        } catch (error) {
            console.error("Error resetting password:", error);
            setErrorMessage("Failed to reset password. Please try again.");
        }
    };

    return (
        <div className="login-container">
            <div className="wrapper">
                <div className="form-box">
                    <form onSubmit={handleResetPassword}>
                        <h1>Reset your password</h1>
                        <p>Enter a new password for your account.</p>
                        <div className="input-box">
                            <input
                                type="password"
                                placeholder="New Password"
                                value={newPassword}
                                onChange={handleNewPasswordChange}
                                required
                            />
                            <RiLockPasswordFill className="icon" />
                        </div>
                        <button type="submit">Save</button>
                        <div className="message-box">
                            {errorMessage && <p className="error">{errorMessage}</p>}
                            {successMessage && <p className="success">{successMessage}</p>}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;



import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import backgroundVideo from "../../Assets/ProfileVideo.mp4";
import { BsListTask } from "react-icons/bs";
import { TbApps } from "react-icons/tb";
import "./AccountSecurity.css";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { UserContext } from "../../UserContext";

const db = getFirestore();

const AccountSecurity = () => {
    const navigate = useNavigate();
    const { user } = useContext(UserContext); // ✅ Get user from context
    const [emailSent, setEmailSent] = useState(false);
    const [error, setError] = useState("");
    const [emailVerified, setEmailVerified] = useState(false);

    const handleBackToHome = () => navigate("/");

    useEffect(() => {
        const checkVerificationStatus = async () => {
            if (!user?.uid) return;

            try {
                const userRef = doc(db, "Users", user.uid);
                const userSnap = await getDoc(userRef);

                if (userSnap.exists()) {
                    const data = userSnap.data();
                    if (data["2faVerified"] === true) {
                        setEmailVerified(true);
                    }
                }
            } catch (err) {
                console.error("Error fetching 2FA status:", err);
            }
        };

        checkVerificationStatus();
    }, [user]);

    const handleEnable2FA = async () => {
        if (!user?.uid) {
            setError("User ID not found. Please ensure you're logged in.");
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/2fa/send-custom-2fa-email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    uid: user.uid,
                    verifyUrl: "http://localhost:3000/verify-link"
                }),
            });

            if (!response.ok) {
                const errMessage = await response.text();
                throw new Error(`Backend returned ${response.status}: ${errMessage}`);
            }

            const data = await response.json();
            console.log("Custom email sent. Backend says:", data);
            setEmailSent(true);

        } catch (err) {
            console.error("Full 2FA flow error:", err);
            setError(`Failed to send verification email. Error: ${err.message}`);
        }
    };


    return (
        <div className="profileContainer">
            <video className="backgroundVideo" src={backgroundVideo} autoPlay loop muted />
            <nav className="profile-navbar">
                <div className="leftIcons">
                    <BsListTask className="icon" onClick={handleBackToHome} />
                    <TbApps className="icon" />
                </div>
            </nav>

            <div className="profile-content">
                <h1>Account Security</h1>
                <div className="profile-view">
                    <p><strong>Two-Factor Authentication:</strong></p>
                    <ul style={{ marginLeft: '1rem', listStyle: 'none', padding: 0 }}>
                        <li>Protect your account with a second layer of security using your email address.</li>
                        <li>Status: {emailVerified ? "Verified ✅" : emailSent ? "Verification link sent ✅" : "Not verified"}</li>
                    </ul>
                    {!emailVerified && (
                        <button onClick={handleEnable2FA}>Pair with email...</button>
                    )}
                    {error && <p style={{ color: "red", marginTop: "0.5rem" }}>{error}</p>}
                </div>
            </div>
        </div>
    );
};

export default AccountSecurity;
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const VerifyEmailLink = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const verifyLink = async () => {
            const queryParams = new URLSearchParams(location.search);
            const email = queryParams.get("email");

            if (!email) return alert("Missing email. Please start over.");

            try {
                const res = await fetch("http://localhost:5000/2fa/mark-2fa-verified", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email })
                });

                const result = await res.json();
                if (!res.ok) throw new Error(result.error || "Verification failed");

                window.localStorage.setItem("2faVerified", "true");
                window.localStorage.setItem("2faEmail", email);

                alert(`✅ 2FA complete for ${email}`);
                navigate("/account-security");

            } catch (err) {
                console.error("Verification failed:", err);
                alert("Verification failed. Please try again.");
            }
        };

        verifyLink();
    }, [location, navigate]);

    return <p>Verifying your email link...</p>;
};

export default VerifyEmailLink;


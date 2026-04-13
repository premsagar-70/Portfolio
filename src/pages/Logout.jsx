import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

const Logout = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const performLogout = async () => {
            try {
                // Clear any leftover tokens or manual auth states
                localStorage.removeItem("access");
                localStorage.removeItem("refresh");
                localStorage.removeItem("user");
                localStorage.removeItem("isAdmin");

                // Sign out of Firebase Auth
                await signOut(auth);
            } catch (error) {
                console.error("Logout error:", error);
            } finally {
                // Always redirect to login or home
                navigate("/login");
            }
        };

        performLogout();
    }, [navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-background text-tx-main">
            <div className="text-center animate-pulse">
                <h2 className="text-2xl font-bold font-outfit mb-2">Signing Out...</h2>
                <p className="text-tx-muted">Clearing securely...</p>
            </div>
        </div>
    );
};

export default Logout;

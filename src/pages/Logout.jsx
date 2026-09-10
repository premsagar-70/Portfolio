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
                setTimeout(() => {
                    navigate("/login", { replace: true });
                }, 2000); // 2 seconds delay
            }
        };

        performLogout();
    }, [navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-background text-tx-main">
            <div className="text-center">
                <div className="w-12 h-12 border-[3px] border-bd border-t-accent rounded-full animate-spin mx-auto mb-4" />
                <h2 className="text-xl font-bold font-outfit mb-1">Signing Out</h2>
                <p className="text-tx-muted text-sm">Clearing your session securely...</p>
            </div>
        </div>
    );
};

export default Logout;

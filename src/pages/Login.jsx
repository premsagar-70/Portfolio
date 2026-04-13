import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        // Hardcoded admin details for testing as requested
        if (email === "admin" && password === "admin@123") {
            localStorage.setItem("isAdmin", "true");
            navigate("/admin");
        } else {
            // setError("Invalid credentials. Try admin / admin@123");
            setError("Invalid credentials");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="w-full max-w-md bg-surface border border-bd/50 rounded-2xl shadow-2xl p-8 transform transition-all hover:scale-[1.01]">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold font-outfit text-tx-main mb-2">Admin Login</h1>
                    <p className="text-tx-muted text-sm">Secure access to your portfolio analytics</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    {error && (
                        <p className="text-red-500 text-xs font-medium text-center bg-red-500/10 py-2 rounded">
                            {error}
                        </p>
                    )}
                    <div>
                        <label className="block text-sm font-medium text-tx-muted mb-2">Username</label>
                        <input
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-background border border-bd/50 rounded-lg px-4 py-3 text-tx-main focus:outline-none focus:border-accent transition-all"
                            placeholder="admin"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-tx-muted mb-2">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-background border border-bd/50 rounded-lg px-4 py-3 text-tx-main focus:outline-none focus:border-accent transition-all"
                            placeholder="••••••••"
                            required
                        />
                    </div>


                    <button
                        type="submit"
                        className="w-full bg-accent hover:bg-accent-hover text-tx-main font-bold py-3 rounded-lg shadow-lg shadow-accent/20 transition-all active:scale-[0.98]"
                    >
                        Sign In
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate("/")}
                        className="w-full text-tx-muted hover:text-accent text-sm transition-all mt-2"
                    >
                        Back to Portfolio
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;

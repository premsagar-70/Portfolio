import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                navigate("/admin");
            }
        });
        return () => unsubscribe();
    }, [navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate("/admin");
        } catch (err) {
            console.error("Login failed:", err);
            setError("Invalid credentials. Please verify your email and password.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
            {/* Subtle background */}
            <div className="absolute top-[-20%] left-[-20%] w-[50%] h-[50%] bg-accent/[0.06] rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-20%] w-[50%] h-[50%] bg-secondary/[0.04] rounded-full blur-[120px] pointer-events-none" />

            <div className="w-full max-w-md relative z-10">
                <div className="bg-surface border border-bd/40 rounded-2xl shadow-xl p-8">
                    <div className="text-center mb-8">
                        <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                        </div>
                        <h1 className="text-2xl font-bold font-outfit text-tx-main mb-1">Admin Login</h1>
                        <p className="text-tx-muted text-sm">Secure access to your portfolio analytics</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-5">
                        {error && (
                            <div className="flex items-center gap-2 text-red-500 text-sm font-medium bg-red-500/10 p-3 rounded-xl border border-red-500/20">
                                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                {error}
                            </div>
                        )}
                        <div>
                            <label htmlFor="login-email" className="block text-sm font-medium text-tx-main mb-2">Email</label>
                            <input
                                id="login-email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-background border border-bd/50 rounded-xl px-4 py-3 text-tx-main placeholder:text-tx-muted/50 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all"
                                placeholder="admin@example.com"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="login-password" className="block text-sm font-medium text-tx-main mb-2">Password</label>
                            <input
                                id="login-password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-background border border-bd/50 rounded-xl px-4 py-3 text-tx-main placeholder:text-tx-muted/50 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full font-semibold py-3.5 rounded-xl transition-all shadow-lg ${
                                loading
                                    ? "bg-accent/50 cursor-not-allowed text-white/70"
                                    : "bg-accent hover:bg-accent-hover text-white shadow-accent/20 active:scale-[0.98]"
                            }`}
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>
                                    Signing in...
                                </span>
                            ) : "Sign In"}
                        </button>

                        <button
                            type="button"
                            onClick={() => navigate("/")}
                            className="w-full text-tx-muted hover:text-accent text-sm font-medium transition-colors pt-2"
                        >
                            ← Back to Portfolio
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;

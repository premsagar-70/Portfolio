import React from "react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
            {/* Background Glows */}
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-accent/20 rounded-full blur-[100px] animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/20 rounded-full blur-[100px] animate-pulse delay-700"></div>

            <div className="text-center relative z-10 w-full max-w-lg p-8 bg-surface/30 backdrop-blur-xl border border-bd/30 rounded-3xl shadow-2xl">
                <h1 className="text-9xl font-bold font-outfit text-accent mb-4 tracking-tighter opacity-80">404</h1>
                <h2 className="text-2xl font-bold text-tx-main mb-4">Space Not Found</h2>
                <p className="text-tx-muted mb-8 max-w-sm mx-auto">
                    Oops! It looks like the page you are searching for has disappeared into the void. Let's get you back to safety.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button 
                        onClick={() => navigate("/")}
                        className="px-8 py-3 bg-accent hover:bg-accent-hover text-tx-main font-bold rounded-xl shadow-lg shadow-accent/20 transition-all active:scale-95"
                    >
                        Back to Home
                    </button>
                    <button 
                        onClick={() => window.history.back()}
                        className="px-8 py-3 bg-surface border border-bd/50 text-tx-muted hover:text-tx-main hover:border-accent/50 rounded-xl transition-all active:scale-95"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NotFound;

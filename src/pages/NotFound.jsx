import React from "react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-6 relative overflow-hidden">
            {/* Subtle background glow */}
            <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-accent/[0.06] rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-secondary/[0.05] rounded-full blur-[100px] pointer-events-none" />

            <div className="text-center relative z-10 w-full max-w-md">
                <h1 className="text-8xl font-extrabold font-outfit text-accent/20 mb-2 tracking-tighter">404</h1>
                <h2 className="text-2xl font-bold font-outfit text-tx-main mb-3">Page Not Found</h2>
                <p className="text-tx-muted mb-8 max-w-sm mx-auto">
                    The page you're looking for doesn't exist or has been moved. Let's get you back on track.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                        onClick={() => navigate("/")}
                        className="px-6 py-3 bg-accent text-white font-semibold rounded-xl hover:bg-accent-hover transition-colors shadow-lg shadow-accent/20 active:scale-[0.98]"
                    >
                        Back to Home
                    </button>
                    <button
                        onClick={() => window.history.back()}
                        className="px-6 py-3 bg-surface border border-bd/50 text-tx-muted hover:text-tx-main font-semibold rounded-xl hover:border-accent/30 transition-all active:scale-[0.98]"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NotFound;

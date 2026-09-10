import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";

const DailyStats = () => {
    const [dailyData, setDailyData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedDay, setExpandedDay] = useState(null);
    const [theme, setTheme] = useState("dark");
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();

    const toggleExpand = (id) => {
        setExpandedDay(prev => prev === id ? null : id);
    };

    useEffect(() => {
        // Detect theme
        const root = document.documentElement;
        setTheme(root.classList.contains("dark") ? "dark" : "light");

        const authUnsubscribe = onAuthStateChanged(auth, (user) => {
            if (!user) {
                navigate("/login");
            }
        });

        const fetchDailyStats = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "analytics"));
                const stats = [];
                querySnapshot.forEach((doc) => {
                    if (doc.id.startsWith("daily_")) {
                        stats.push({
                            id: doc.id,
                            ...doc.data()
                        });
                    }
                });

                stats.sort((a, b) => new Date(b.date) - new Date(a.date));
                setDailyData(stats);
            } catch (error) {
                console.error("Error fetching daily stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDailyStats();

        return () => authUnsubscribe();
    }, [navigate]);

    const toggleTheme = () => {
        const root = document.documentElement;
        if (theme === "dark") {
            root.classList.remove("dark");
            localStorage.setItem("theme", "light");
            setTheme("light");
        } else {
            root.classList.add("dark");
            localStorage.setItem("theme", "dark");
            setTheme("dark");
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 border-[3px] border-bd border-t-accent rounded-full animate-spin" />
                <p className="text-tx-muted text-sm font-medium">Loading analytics history...</p>
            </div>
        </div>
    );

    const filteredDailyData = dailyData.filter(day => 
        day.date.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="h-screen w-screen overflow-hidden bg-background text-tx-main font-sans flex flex-col lg:flex-row">
            {/* Sidebar */}
            <aside className="w-64 h-full bg-surface border-r border-bd/40 hidden lg:flex flex-col shrink-0">
                <div className="h-16 flex items-center px-6 border-b border-bd/30 gap-3">
                    <button
                        onClick={() => navigate("/admin")}
                        className="p-1.5 rounded-lg hover:bg-background text-tx-muted hover:text-tx-main transition-colors"
                        aria-label="Back to dashboard"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                    </button>
                    <span className="font-outfit font-bold text-lg tracking-tight">Analytics</span>
                </div>

                <div className="flex-1 py-6 px-4 space-y-1">
                    <button
                        onClick={() => navigate("/admin")}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-tx-muted hover:text-tx-main hover:bg-background transition-all"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
                        Dashboard
                    </button>
                    <button
                        onClick={() => navigate("/admin/daily-stats")}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium bg-accent text-white shadow-lg shadow-accent/20 transition-all"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                        Daily Analytics
                    </button>
                    <button
                        onClick={() => navigate("/admin/database")}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-tx-muted hover:text-tx-main hover:bg-background transition-all"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"></path></svg>
                        Database Explorer
                    </button>
                </div>

                <div className="p-4 border-t border-bd/30 space-y-2">
                    <button
                        onClick={toggleTheme}
                        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-tx-muted hover:text-tx-main hover:bg-background transition-all"
                    >
                        {theme === "dark" ? (
                            <>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707.707M12 8a4 4 0 100 8 4 4 0 000-8z"></path></svg>
                                Light Mode
                            </>
                        ) : (
                            <>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
                                Dark Mode
                            </>
                        )}
                    </button>
                    <button
                        onClick={() => navigate("/logout")}
                        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-red-500 hover:bg-red-500/10 transition-all font-medium"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Area */}
            <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
                <header className="sticky top-0 z-40 bg-surface/80 backdrop-blur-xl border-b border-bd/45 px-6 h-16 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate("/admin")}
                            className="p-1.5 rounded-lg hover:bg-background text-tx-muted hover:text-tx-main transition-colors lg:hidden"
                            aria-label="Back to dashboard"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                        </button>
                        <h1 className="font-outfit font-bold text-lg text-tx-main">Daily Visitor Logs</h1>
                    </div>

                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-lg text-tx-muted hover:text-tx-main hover:bg-surface/50 lg:hidden"
                        aria-label="Toggle theme"
                    >
                        {theme === "dark" ? (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707.707M12 8a4 4 0 100 8 4 4 0 000-8z"></path></svg>
                        ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
                        )}
                    </button>
                </header>

                <main className="flex-1 p-6 md:p-8 space-y-6 overflow-y-auto max-w-5xl w-full mx-auto">
                    {/* Toolbar */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h2 className="text-xl font-bold font-outfit text-tx-main">Visitor Summaries by Day</h2>
                            <p className="text-xs text-tx-muted mt-0.5">Click on a day to view rich session logs</p>
                        </div>

                        {/* Search input */}
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search by date (YYYY-MM-DD)..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full sm:w-64 bg-surface border border-bd/50 rounded-xl pl-9 pr-4 py-2 text-sm text-tx-main focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
                            />
                            <svg className="w-4 h-4 text-tx-muted absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                        </div>
                    </div>

                    {/* Daily Logs List */}
                    <div className="bg-surface border border-bd/40 rounded-2xl overflow-hidden shadow-sm">
                        {filteredDailyData.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-bd/35 bg-background/30 text-[10px] uppercase tracking-wider font-semibold text-tx-muted">
                                            <th className="py-3.5 px-5">Date</th>
                                            <th className="py-3.5 px-5 text-right">Total Visits</th>
                                            <th className="py-3.5 px-5 text-right">Unique Sessions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-bd/15">
                                        {filteredDailyData.map((day) => (
                                            <React.Fragment key={day.id}>
                                                <tr
                                                    onClick={() => toggleExpand(day.id)}
                                                    className="hover:bg-background/40 transition-colors cursor-pointer"
                                                >
                                                    <td className="py-4 px-5 font-semibold text-tx-main flex items-center gap-2">
                                                        <svg className={`w-4 h-4 text-tx-muted transition-transform duration-200 ${expandedDay === day.id ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                                                        {day.date}
                                                    </td>
                                                    <td className="py-4 px-5 text-right text-tx-muted font-medium">{day.visits || 0}</td>
                                                    <td className="py-4 px-5 text-right font-extrabold text-accent">{day.unique_today || 0}</td>
                                                </tr>
                                                {expandedDay === day.id && (
                                                    <tr>
                                                        <td colSpan="3" className="p-5 bg-background/30">
                                                            {day.visitLogs && day.visitLogs.length > 0 ? (
                                                                <div className="space-y-3">
                                                                    <h4 className="text-[10px] font-bold text-tx-muted uppercase tracking-wider mb-2">Detailed Daily Session Logs</h4>
                                                                    <div className="overflow-hidden border border-bd/35 rounded-xl bg-surface divide-y divide-bd/20 shadow-inner">
                                                                        <div className="grid grid-cols-12 text-[9px] uppercase tracking-wider font-semibold text-tx-muted bg-background/20 py-2.5 px-4">
                                                                            <span className="col-span-2">Time</span>
                                                                            <span className="col-span-2">Browser</span>
                                                                            <span className="col-span-3">Device / OS</span>
                                                                            <span className="col-span-2">Referrer</span>
                                                                            <span className="col-span-2">Page URL</span>
                                                                            <span className="col-span-1 text-right">Type</span>
                                                                        </div>
                                                                        {day.visitLogs.sort((a, b) => new Date(b.time) - new Date(a.time)).map((log, idx) => (
                                                                            <div key={idx} className="grid grid-cols-12 py-3.5 px-4 text-xs items-center hover:bg-background/20 transition-all">
                                                                                <span className="col-span-2 text-tx-muted">
                                                                                    {new Date(log.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                                                                </span>
                                                                                <span className="col-span-2 font-medium truncate pr-2">{log.browser}</span>
                                                                                <span className="col-span-3 text-tx-muted truncate pr-2">{log.device}</span>
                                                                                <span className="col-span-2 text-accent truncate pr-2">{log.referrer || "Direct/Search"}</span>
                                                                                <span className="col-span-2 text-tx-muted truncate pr-2" title={log.page}>{log.page || "/"}</span>
                                                                                <span className="col-span-1 text-right">
                                                                                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                                                                                        log.isNewVisitor 
                                                                                            ? "bg-emerald-500/10 text-emerald-500" 
                                                                                            : "bg-blue-500/10 text-blue-500"
                                                                                    }`}>
                                                                                        {log.isNewVisitor ? "New" : "Ret"}
                                                                                    </span>
                                                                                </span>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <div className="text-center py-6 text-tx-muted text-sm italic bg-surface border border-bd/35 rounded-xl">
                                                                    No session logs captured for this day.
                                                                </div>
                                                            )}
                                                        </td>
                                                    </tr>
                                                )}
                                            </React.Fragment>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="py-20 text-center text-tx-muted flex flex-col items-center justify-center">
                                <div className="w-12 h-12 bg-background border border-bd/35 rounded-full flex items-center justify-center mb-4">
                                    <svg className="w-5 h-5 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                </div>
                                <p className="font-semibold text-sm">No visitor logs found</p>
                                <p className="text-xs opacity-75 mt-1">Try searching another date pattern.</p>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DailyStats;

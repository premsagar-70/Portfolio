import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";

const DailyStats = () => {
    const [dailyData, setDailyData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedDay, setExpandedDay] = useState(null);
    const navigate = useNavigate();

    const toggleExpand = (id) => {
        setExpandedDay(prev => prev === id ? null : id);
    };

    useEffect(() => {
        // Auth Check
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

                // Sort by date descending (newest first)
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

    if (loading) return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-accent"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-background text-tx-main p-4 md:p-8 font-sans">
            {/* Header */}
            <header className="flex items-center mb-8 gap-4">
                <button 
                    onClick={() => navigate("/admin")}
                    className="p-2 bg-surface border border-bd/50 rounded-full hover:bg-accent/10 hover:border-accent transition-all"
                >
                    <svg className="w-6 h-6 text-tx-main" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                </button>
                <div>
                    <h1 className="text-3xl font-bold font-outfit text-accent">Daily Visitor Stats</h1>
                    <p className="text-tx-muted mt-1">Unique visitors per day</p>
                </div>
            </header>

            {/* Stats Table/List */}
            <div className="bg-surface border border-bd/30 rounded-2xl p-6 shadow-xl max-w-4xl mx-auto">
                {dailyData.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-bd/30">
                                    <th className="py-3 px-4 text-tx-muted font-medium">Date</th>
                                    <th className="py-3 px-4 text-tx-muted font-medium text-right">Total Visits</th>
                                    <th className="py-3 px-4 text-tx-muted font-medium text-right">Unique Visitors</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dailyData.map((day) => (
                                    <React.Fragment key={day.id}>
                                        <tr 
                                            onClick={() => toggleExpand(day.id)}
                                            className="border-b border-bd/10 hover:bg-background/50 transition-colors cursor-pointer"
                                        >
                                            <td className="py-4 px-4 font-medium flex items-center gap-2">
                                                <svg className={`w-4 h-4 transition-transform ${expandedDay === day.id ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                                                {day.date}
                                            </td>
                                            <td className="py-4 px-4 text-right">{day.visits || 0}</td>
                                            <td className="py-4 px-4 text-right text-accent font-bold">{day.unique_today || 0}</td>
                                        </tr>
                                        {expandedDay === day.id && (
                                            <tr className="bg-surface/50">
                                                <td colSpan="3" className="p-4 border-b border-bd/10">
                                                    {day.visitLogs && day.visitLogs.length > 0 ? (
                                                        <div className="bg-background rounded-lg p-4 max-h-60 overflow-y-auto">
                                                            <h4 className="text-sm font-bold text-tx-muted mb-3 uppercase tracking-wider">Visit Details</h4>
                                                            <div className="space-y-3">
                                                                {(() => {
                                                                    const aggregated = day.visitLogs.reduce((acc, log) => {
                                                                        const key = `${log.device}-${log.browser}`;
                                                                        if (!acc[key]) {
                                                                            acc[key] = { ...log, count: 0, times: [] };
                                                                        }
                                                                        acc[key].count += 1;
                                                                        acc[key].times.push(log.time);
                                                                        return acc;
                                                                    }, {});
                                                                    
                                                                    return Object.values(aggregated).sort((a, b) => b.count - a.count).map((log, idx) => (
                                                                        <div key={idx} className="flex flex-col gap-2 bg-surface p-3 rounded-md border border-bd/20 text-sm">
                                                                            <div className="flex flex-wrap md:flex-nowrap items-center gap-4">
                                                                                <div className="flex items-center gap-2 text-tx-muted min-w-[150px]">
                                                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                                                                                    {log.device || "Unknown Device"}
                                                                                </div>
                                                                                <div className="flex items-center gap-2 text-tx-muted">
                                                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path></svg>
                                                                                    {log.browser || "Unknown Browser"}
                                                                                </div>
                                                                                <div className="ml-auto">
                                                                                    <span className="text-xs font-bold text-accent bg-accent/10 px-3 py-1 rounded-full border border-accent/20 shadow-sm">
                                                                                        {log.count} {log.count === 1 ? 'visit' : 'visits'}
                                                                                    </span>
                                                                                </div>
                                                                            </div>
                                                                            {log.times && log.times.length > 0 && (
                                                                                <div className="pl-6 pt-1 text-xs text-tx-muted/70 flex flex-wrap items-center gap-2 border-t border-bd/10 mt-1">
                                                                                    <span className="font-semibold text-tx-muted">Opened at:</span>
                                                                                    {log.times.sort().map((t, i) => (
                                                                                        <span key={i} className="bg-background/40 px-2 py-0.5 rounded border border-bd/5">
                                                                                            {new Date(t).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                                                        </span>
                                                                                    ))}
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    ));
                                                                })()}
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="text-center py-4 text-tx-muted text-sm">
                                                            No detailed logs available for this day. (Feature added recently)
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
                    <div className="py-12 text-center text-tx-muted">
                        No daily stats available yet.
                    </div>
                )}
            </div>
        </div>
    );
};

export default DailyStats;

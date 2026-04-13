import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import {
    collection,
    query,
    orderBy,
    onSnapshot,
    doc,
    getDoc,
    updateDoc,
    deleteDoc,
    increment
} from "firebase/firestore";

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        total_visits: 0,
        unique_visitors: 0,
        total_submissions: 0,
        today_visits: 0,
        unique_today: 0
    });
    const [projectViews, setProjectViews] = useState({});
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [notification, setNotification] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Auth Check
        const authUnsubscribe = onAuthStateChanged(auth, (user) => {
            if (!user) {
                navigate("/login");
            }
        });

        // 1. Fetch Overview Stats
        const fetchStats = async () => {
            const overviewDoc = await getDoc(doc(db, "analytics", "overview"));
            if (overviewDoc.exists()) {
                setStats(prev => ({ ...prev, ...overviewDoc.data() }));
            }

            const today = new Date().toISOString().split('T')[0];
            const todayDoc = await getDoc(doc(db, "analytics", `daily_${today}`));
            if (todayDoc.exists()) {
                const dailyData = todayDoc.data();
                setStats(prev => ({
                    ...prev,
                    today_visits: dailyData.visits || 0,
                    unique_today: dailyData.unique_today || 0
                }));
            }

            const projectsDoc = await getDoc(doc(db, "analytics", "projects"));
            if (projectsDoc.exists()) {
                setProjectViews(projectsDoc.data());
            }
        };

        fetchStats();

        // 2. Real-time Messages Listener
        let isFirstSnapshot = true;
        const q = query(collection(db, "messages"), orderBy("timestamp", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const msgs = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            // Trigger notification ONLY for new added documents that are unread
            // and ONLY after the initial load
            if (!isFirstSnapshot) {
                snapshot.docChanges().forEach((change) => {
                    if (change.type === "added") {
                        const newMsg = change.doc.data();
                        if (newMsg.status === "unread") {
                            setNotification({
                                title: "New Message",
                                body: `From: ${newMsg.name}`
                            });
                            setTimeout(() => setNotification(null), 5000);
                        }
                    }
                });
            }

            isFirstSnapshot = false;
            setMessages(msgs);
            setLoading(false);
        });


        return () => {
            unsubscribe();
            authUnsubscribe();
        };
    }, [navigate]);

    const handleMarkAsRead = async (id) => {
        await updateDoc(doc(db, "messages", id), { status: "read" });
    };

    const handleDeleteMessage = async (id) => {
        if (window.confirm("Are you sure you want to delete this message?")) {
            try {
                // 1. Delete the message document
                await deleteDoc(doc(db, "messages", id));

                // 2. Decrement the total submissions count in analytics
                const statsRef = doc(db, "analytics", "overview");
                await updateDoc(statsRef, {
                    total_submissions: increment(-1)
                });
            } catch (error) {
                console.error("Error deleting message:", error);
                alert("Failed to delete message. Check permissions.");
            }
        }
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            // Clean up any remaining localStorage items from old auth systems
            localStorage.removeItem("access");
            localStorage.removeItem("refresh");
            localStorage.removeItem("user");
            localStorage.removeItem("isAdmin");
            navigate("/login");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-accent"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-background text-tx-main p-4 md:p-8 font-sans">
            {/* Header */}
            <header className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div>
                    <h1 className="text-4xl font-bold font-outfit text-accent">Analytics Dashboard</h1>
                    <p className="text-tx-muted mt-1">Real-time portfolio performance monitoring</p>
                </div>
                <button
                    onClick={handleLogout}
                    className="px-6 py-2 bg-surface border border-bd/50 rounded-full hover:bg-red-500/10 hover:border-red-500/50 hover:text-red-500 transition-all shadow-lg"
                >
                    Sign Out
                </button>
            </header>

            {/* Notification Toast */}
            {notification && (
                <div className="fixed top-8 right-8 z-50 animate-bounce-in">
                    <div className="bg-accent text-white p-4 rounded-xl shadow-2xl shadow-accent/40 flex items-center gap-4">
                        <div className="bg-white/20 p-2 rounded-lg">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
                        </div>
                        <div>
                            <p className="font-bold">{notification.title}</p>
                            <p className="text-sm opacity-90">{notification.body}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-12">
                <StatCard title="Total Visits" value={stats.total_visits || 0} color="blue" icon="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <StatCard title="Unique Visitors" value={stats.unique_visitors || 0} color="purple" icon="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                <StatCard title="Today's Visits" value={stats.today_visits || 0} color="green" icon="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                <StatCard title="Unique Today" value={stats.unique_today || 0} color="cyan" icon="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                <StatCard title="Form Submissions" value={stats.total_submissions || 0} color="orange" icon="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Project Analytics */}
                {/* <div className="lg:col-span-1 bg-surface border border-bd/30 rounded-2xl p-6 shadow-xl h-fit">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <span className="w-1.5 h-6 bg-accent rounded-full"></span>
                        Project Views
                    </h2>
                    <div className="space-y-4">
                        {Object.entries(projectViews).length > 0 ? (
                            Object.entries(projectViews).sort((a, b) => b[1] - a[1]).map(([title, count]) => (
                                <div key={title} className="flex justify-between items-center group">
                                    <span className="text-tx-muted group-hover:text-tx-main transition-colors text-sm">{title}</span>
                                    <span className="font-bold text-accent bg-accent/10 px-3 py-1 rounded-full text-xs">{count} views</span>
                                </div>
                            ))
                        ) : (
                            <p className="text-tx-muted text-center py-4">No project data yet</p>
                        )}
                    </div>
                </div> */}

                {/* Messages List */}
                <div className="lg:col-span-2 bg-surface border border-bd/30 rounded-2xl p-6 shadow-xl min-h-[500px]">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <span className="w-1.5 h-6 bg-accent rounded-full"></span>
                        Contact Messages
                    </h2>
                    <div className="space-y-4">
                        {messages.length > 0 ? (
                            messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`relative p-5 rounded-xl border transition-all hover:shadow-lg ${msg.status === 'unread' ? 'bg-accent/5 border-accent/20' : 'bg-background/50 border-bd/20'
                                        }`}
                                >
                                    {msg.status === 'unread' && (
                                        <span className="absolute top-4 right-4 flex h-3 w-3">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-3 w-3 bg-accent"></span>
                                        </span>
                                    )}
                                    <div className="flex flex-col md:flex-row md:items-center gap-4 mb-3">
                                        <div className="font-bold text-lg">{msg.name}</div>
                                        <div className="text-tx-muted text-sm">{msg.email}</div>
                                        <div className="text-xs text-tx-muted md:ml-auto">
                                            {msg.timestamp?.toDate().toLocaleString() || 'Just now'}
                                        </div>
                                    </div>
                                    <p className="text-tx-muted text-sm mb-4 leading-relaxed">{msg.message}</p>
                                    <div className="flex gap-3">
                                        {msg.status === 'unread' && (
                                            <button
                                                onClick={() => handleMarkAsRead(msg.id)}
                                                className="text-xs font-bold text-accent hover:underline"
                                            >
                                                Mark as read
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleDeleteMessage(msg.id)}
                                            className="text-xs font-bold text-red-500/70 hover:text-red-500 transition-colors"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="h-64 flex items-center justify-center text-tx-muted italic">
                                No messages received yet.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ title, value, color, icon }) => {
    const colors = {
        blue: "text-blue-500 bg-blue-500/10",
        purple: "text-purple-500 bg-purple-500/10",
        green: "text-green-500 bg-green-500/10",
        orange: "text-orange-500 bg-orange-500/10",
        cyan: "text-cyan-500 bg-cyan-500/10"
    };

    return (
        <div className="bg-surface border border-bd/30 rounded-2xl p-6 shadow-xl transform transition-all hover:translate-y-[-4px]">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${colors[color]}`}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={icon}></path>
                </svg>
            </div>
            <p className="text-tx-muted text-sm mb-1">{title}</p>
            <h3 className="text-3xl font-bold font-outfit">{value}</h3>
        </div>
    );
};

export default AdminDashboard;

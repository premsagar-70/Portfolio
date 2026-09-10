import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { usePortfolioData } from "../hooks/usePortfolioData";
import {
    collection,
    query,
    orderBy,
    onSnapshot,
    doc,
    getDoc,
    getDocs,
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
    const [messages, setMessages] = useState([]);
    const [dailyHistory, setDailyHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("overview"); // overview, messages, sessions, data
    const [searchQuery, setSearchQuery] = useState("");
    const [messageFilter, setMessageFilter] = useState("all"); // all, read, unread
    const [notification, setNotification] = useState(null);
    const [theme, setTheme] = useState("dark");
    const [timelineDays, setTimelineDays] = useState(7);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const navigate = useNavigate();

    const getMailtoLink = (msg) => {
        if (!msg) return "";
        const subject = encodeURIComponent("Regarding your message on my Portfolio");
        const body = encodeURIComponent(
            `Hi ${msg.name},\n\nThank you for reaching out through my portfolio. Regarding your message:\n\n"${msg.message}"\n\nBest regards,\nPrem Sagar`
        );
        return `mailto:${msg.email}?subject=${subject}&body=${body}`;
    };

    const handleOpenMessage = (msg) => {
        setSelectedMessage(msg);
        if (msg.status === "unread") {
            handleMarkAsRead(msg.id);
        }
    };

    // Portfolio CMS Hook
    const { data: portfolioData, updatePortfolioData } = usePortfolioData();
    const [cmsProfile, setCmsProfile] = useState(null);
    const [cmsSkills, setCmsSkills] = useState([]);
    const [cmsProjects, setCmsProjects] = useState([]);
    const [cmsEducation, setCmsEducation] = useState([]);
    const [activeCmsSec, setActiveCmsSec] = useState("profile"); // profile, projects, skills, education
    const [isSaving, setIsSaving] = useState(false);
    const [cmsSaveMsg, setCmsSaveMsg] = useState("");

    // Temporary states for additions
    const [newProject, setNewProject] = useState({ title: "", description: "", tags: "", image: "", link: "", github: "" });
    const [newSkillGroup, setNewSkillGroup] = useState({ category: "", items: "" });
    const [newEdu, setNewEdu] = useState({ degree: "", school: "", date: "", bullets: "" });

    // Editing states for CMS lists
    const [editingProjectIdx, setEditingProjectIdx] = useState(null);
    const [editingProjectData, setEditingProjectData] = useState({ title: "", description: "", tags: "", image: "", link: "", github: "" });

    const [editingEduIdx, setEditingEduIdx] = useState(null);
    const [editingEduData, setEditingEduData] = useState({ degree: "", school: "", date: "", bullets: "" });

    const [editingSkillIdx, setEditingSkillIdx] = useState(null);
    const [editingSkillData, setEditingSkillData] = useState({ category: "", items: "" });

    useEffect(() => {
        if (portfolioData) {
            setCmsProfile(portfolioData.profile);
            setCmsSkills(portfolioData.skills);
            setCmsProjects(portfolioData.projects);
            setCmsEducation(portfolioData.education);
        }
    }, [portfolioData]);

    useEffect(() => {
        // Detect theme
        const root = document.documentElement;
        setTheme(root.classList.contains("dark") ? "dark" : "light");

        const authUnsubscribe = onAuthStateChanged(auth, (user) => {
            if (!user) {
                navigate("/login");
            }
        });

        const fetchOverviewAndHistory = async () => {
            try {
                // Fetch general overview
                const overviewDoc = await getDoc(doc(db, "analytics", "overview"));
                let overviewData = { total_visits: 0, unique_visitors: 0, total_submissions: 0 };
                if (overviewDoc.exists()) {
                    overviewData = overviewDoc.data();
                }

                // Fetch today's daily doc
                const todayStr = new Date().toISOString().split('T')[0];
                const todayDoc = await getDoc(doc(db, "analytics", `daily_${todayStr}`));
                let todayVisits = 0;
                let todayUnique = 0;
                if (todayDoc.exists()) {
                    const todayData = todayDoc.data();
                    todayVisits = todayData.visits || 0;
                    todayUnique = todayData.unique_today || 0;
                }

                setStats({
                    ...overviewData,
                    today_visits: todayVisits,
                    unique_today: todayUnique
                });

                // Fetch historical daily analytics documents (limit to last 30 entries)
                const querySnapshot = await getDocs(collection(db, "analytics"));
                const history = [];
                querySnapshot.forEach((doc) => {
                    if (doc.id.startsWith("daily_")) {
                        history.push({
                            id: doc.id,
                            ...doc.data()
                        });
                    }
                });
                history.sort((a, b) => new Date(a.date) - new Date(b.date)); // chronological order
                setDailyHistory(history);

            } catch (err) {
                console.error("Error fetching overview data:", err);
            }
        };

        fetchOverviewAndHistory();

        let isFirstSnapshot = true;
        const q = query(collection(db, "messages"), orderBy("timestamp", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const msgs = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

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

    const handleMarkAsRead = async (id) => {
        await updateDoc(doc(db, "messages", id), { status: "read" });
    };

    const handleDeleteMessage = async (id) => {
        if (window.confirm("Are you sure you want to delete this message?")) {
            try {
                await deleteDoc(doc(db, "messages", id));
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

    // CMS Save Handler
    const handleCmsSave = async () => {
        setIsSaving(true);
        setCmsSaveMsg("");
        try {
            const updatedData = {
                profile: cmsProfile,
                skills: cmsSkills,
                projects: cmsProjects,
                education: cmsEducation
            };
            await updatePortfolioData(updatedData);
            setCmsSaveMsg("Portfolio data successfully published!");
            setTimeout(() => setCmsSaveMsg(""), 4000);
        } catch (err) {
            setCmsSaveMsg("Error saving changes. Check console.");
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 border-[3px] border-bd border-t-accent rounded-full animate-spin" />
                <p className="text-tx-muted text-sm font-medium">Loading workspace...</p>
            </div>
        </div>
    );

    // Compute device, browser and referrer statistics from the history logs
    const getAllVisitLogs = () => {
        return dailyHistory.flatMap(day => (day.visitLogs || []).map(log => ({ ...log, date: day.date })));
    };

    const visitLogs = getAllVisitLogs().sort((a, b) => new Date(b.time) - new Date(a.time));

    const getAggregatedData = (key) => {
        const counts = {};
        visitLogs.forEach(log => {
            const val = log[key] || "Unknown";
            counts[val] = (counts[val] || 0) + 1;
        });
        return Object.entries(counts)
            .map(([label, value]) => ({ label, value }))
            .sort((a, b) => b.value - a.value);
    };

    const browsers = getAggregatedData("browser").slice(0, 5);
    const devices = getAggregatedData("device").slice(0, 5);
    const referrers = getAggregatedData("referrer").slice(0, 5);

    // Filter messages
    const filteredMessages = messages.filter(msg => {
        const matchesQuery = (msg.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              msg.email?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              msg.message?.toLowerCase().includes(searchQuery.toLowerCase()));
        if (messageFilter === "read") return matchesQuery && msg.status === "read";
        if (messageFilter === "unread") return matchesQuery && msg.status === "unread";
        return matchesQuery;
    });

    const unreadCount = messages.filter(m => m.status === 'unread').length;

    // Build SVG coordinates for Area Chart (7 days)
    const chartData = dailyHistory.slice(-timelineDays);
    const maxVal = Math.max(...chartData.map(d => Math.max(d.visits || 0, d.unique_today || 0)), 10);
    const chartWidth = 500;
    const chartHeight = 150;
    const padding = 20;

    const getCoordinates = (type) => {
        if (chartData.length < 2) return "";
        const stepX = (chartWidth - padding * 2) / (chartData.length - 1);
        const ratioY = (chartHeight - padding * 2) / maxVal;

        return chartData.map((d, index) => {
            const x = padding + index * stepX;
            const val = type === "visits" ? (d.visits || 0) : (d.unique_today || 0);
            const y = chartHeight - padding - val * ratioY;
            return `${x},${y}`;
        }).join(" ");
    };

    const visitsPoints = getCoordinates("visits");
    const uniquePoints = getCoordinates("uniques");

    return (
        <div className="h-screen w-screen overflow-hidden bg-background text-tx-main font-sans flex flex-col lg:flex-row">
            {/* Sidebar (Desktop only) */}
            <aside className="w-64 h-full bg-surface border-r border-bd/40 hidden lg:flex flex-col shrink-0">
                <div className="h-16 flex items-center px-6 border-b border-bd/30 gap-3">
                    <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-white font-bold font-outfit">
                        P
                    </div>
                    <span className="font-outfit font-bold text-lg tracking-tight text-gradient">Prem Admin</span>
                </div>

                <div className="flex-1 py-6 px-4 space-y-1">
                    <button
                        onClick={() => setActiveTab("overview")}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                            activeTab === "overview"
                                ? "bg-accent text-white shadow-lg shadow-accent/20"
                                : "text-tx-muted hover:text-tx-main hover:bg-background"
                        }`}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
                        Overview
                    </button>
                    <button
                        onClick={() => setActiveTab("messages")}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                            activeTab === "messages"
                                ? "bg-accent text-white shadow-lg shadow-accent/20"
                                : "text-tx-muted hover:text-tx-main hover:bg-background"
                        }`}
                    >
                        <span className="flex items-center gap-3">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                            Messages
                        </span>
                        {unreadCount > 0 && (
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                activeTab === "messages" ? "bg-white text-accent" : "bg-accent text-white"
                            }`}>
                                {unreadCount}
                            </span>
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab("sessions")}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                            activeTab === "sessions"
                                ? "bg-accent text-white shadow-lg shadow-accent/20"
                                : "text-tx-muted hover:text-tx-main hover:bg-background"
                        }`}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                        Audience Logs
                    </button>
                    <button
                        onClick={() => setActiveTab("data")}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                            activeTab === "data"
                                ? "bg-accent text-white shadow-lg shadow-accent/20"
                                : "text-tx-muted hover:text-tx-main hover:bg-background"
                        }`}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                        Manage Data
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
                {/* Mobile / Sticky Header */}
                <header className="sticky top-0 z-40 bg-surface/80 backdrop-blur-xl border-b border-bd/45 px-6 h-16 flex items-center justify-between shrink-0">
                    <span className="lg:hidden font-outfit font-bold text-lg text-gradient">Prem Admin</span>
                    <span className="hidden lg:inline text-sm font-medium text-tx-muted">
                        Welcome back! System status: <span className="text-emerald-500 font-bold">Online</span>
                    </span>

                    <div className="flex items-center gap-2">
                        {/* Theme Toggle (Mobile) */}
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

                        {/* Quick Sign Out (Mobile) */}
                        <button
                            onClick={() => navigate("/logout")}
                            className="px-3.5 py-1.5 bg-red-500/10 text-red-500 text-xs font-semibold rounded-lg hover:bg-red-500 hover:text-white transition-all lg:hidden"
                        >
                            Logout
                        </button>
                    </div>
                </header>

                <main className="flex-1 p-6 md:p-8 space-y-8 overflow-y-auto">
                    {/* Notification Toast */}
                    {notification && (
                        <div className="fixed top-20 right-6 z-50 animate-slide-down">
                            <div className="bg-surface border border-bd/40 p-4 rounded-xl shadow-xl flex items-center gap-3">
                                <div className="p-2 bg-accent/10 rounded-lg text-accent">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
                                </div>
                                <div>
                                    <p className="font-semibold text-sm text-tx-main">{notification.title}</p>
                                    <p className="text-xs text-tx-muted">{notification.body}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Mobile tabs */}
                    <div className="flex border-b border-bd/30 lg:hidden mb-6 gap-2">
                        {["overview", "messages", "sessions", "data"].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`flex-1 py-3 text-sm font-semibold capitalize border-b-2 transition-all ${
                                    activeTab === tab
                                        ? "border-accent text-accent"
                                        : "border-transparent text-tx-muted"
                                }`}
                            >
                                {tab === "sessions" ? "Audience" : tab === "data" ? "Content" : tab}
                            </button>
                        ))}
                    </div>

                    {/* ───────────────── OVERVIEW TAB ───────────────── */}
                    {activeTab === "overview" && (
                        <div className="space-y-8 animate-fade-in">
                            {/* KPI Metrics */}
                            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                                <StatCard title="Total Visits" value={stats.total_visits || 0} icon="visits" />
                                <StatCard title="Unique Visitors" value={stats.unique_visitors || 0} icon="visitors" />
                                <StatCard title="Today's Visits" value={stats.today_visits || 0} icon="today" />
                                <StatCard title="Unique Today" value={stats.unique_today || 0} icon="today_unique" />
                                <StatCard title="Inbound Messages" value={stats.total_submissions || 0} icon="messages" />
                            </div>

                            {/* Main charts section */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* SVG Line Trend Chart */}
                                <div className="lg:col-span-2 bg-surface border border-bd/45 rounded-2xl p-6 flex flex-col justify-between min-h-[300px]">
                                    <div className="flex justify-between items-center mb-4">
                                        <div>
                                            <h3 className="font-bold font-outfit text-base">Traffic Overview</h3>
                                            <p className="text-xs text-tx-muted">Daily page views & unique sessions</p>
                                        </div>
                                        <div className="flex items-center gap-4 text-xs font-semibold">
                                            {/* Timeline Dropdown */}
                                            <select
                                                value={timelineDays}
                                                onChange={(e) => setTimelineDays(Number(e.target.value))}
                                                className="bg-background border border-bd/40 rounded-xl px-3 py-1.5 text-xs text-tx-main focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all cursor-pointer font-medium"
                                            >
                                                <option value={7}>Last 7 Days</option>
                                                <option value={15}>Last 15 Days</option>
                                                <option value={30}>Last 30 Days</option>
                                            </select>

                                            <span className="flex items-center gap-1.5 text-accent hidden sm:inline-flex">
                                                <span className="w-2.5 h-2.5 rounded-full bg-accent inline-block" />
                                                Page Views
                                            </span>
                                            <span className="flex items-center gap-1.5 text-secondary hidden sm:inline-flex">
                                                <span className="w-2.5 h-2.5 rounded-full bg-secondary inline-block" />
                                                Uniques
                                            </span>
                                        </div>
                                    </div>

                                    {chartData.length >= 2 ? (
                                        <div className="flex-1 w-full relative">
                                            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-full overflow-visible">
                                                {/* Grid lines */}
                                                <line x1={padding} y1={padding} x2={chartWidth - padding} y2={padding} stroke="currentColor" className="text-bd/20" strokeWidth="1" strokeDasharray="3" />
                                                <line x1={padding} y1={chartHeight / 2} x2={chartWidth - padding} y2={chartHeight / 2} stroke="currentColor" className="text-bd/20" strokeWidth="1" strokeDasharray="3" />
                                                <line x1={padding} y1={chartHeight - padding} x2={chartWidth - padding} y2={chartHeight - padding} stroke="currentColor" className="text-bd/30" strokeWidth="1" />

                                                {/* Page Views Area */}
                                                {visitsPoints && (
                                                    <>
                                                        <path
                                                            d={`M ${padding},${chartHeight - padding} L ${visitsPoints} L ${chartWidth - padding},${chartHeight - padding} Z`}
                                                            fill="url(#visits-gradient)"
                                                            opacity="0.15"
                                                        />
                                                        <polyline
                                                            fill="none"
                                                            stroke="rgb(var(--color-accent))"
                                                            strokeWidth="3"
                                                            points={visitsPoints}
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        />
                                                    </>
                                                )}

                                                {/* Uniques Area */}
                                                {uniquePoints && (
                                                    <>
                                                        <path
                                                            d={`M ${padding},${chartHeight - padding} L ${uniquePoints} L ${chartWidth - padding},${chartHeight - padding} Z`}
                                                            fill="url(#uniques-gradient)"
                                                            opacity="0.1"
                                                        />
                                                        <polyline
                                                            fill="none"
                                                            stroke="rgb(var(--color-secondary))"
                                                            strokeWidth="2.5"
                                                            points={uniquePoints}
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        />
                                                    </>
                                                )}

                                                {/* Definitions */}
                                                <defs>
                                                    <linearGradient id="visits-gradient" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="0%" stopColor="rgb(var(--color-accent))" />
                                                        <stop offset="100%" stopColor="rgb(var(--color-accent))" stopOpacity="0" />
                                                    </linearGradient>
                                                    <linearGradient id="uniques-gradient" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="0%" stopColor="rgb(var(--color-secondary))" />
                                                        <stop offset="100%" stopColor="rgb(var(--color-secondary))" stopOpacity="0" />
                                                    </linearGradient>
                                                </defs>
                                            </svg>
                                            {/* X axis labels */}
                                            <div className="flex justify-between px-5 text-[9px] text-tx-muted font-bold mt-2">
                                                {chartData.map((d, index) => {
                                                    const showLabel = 
                                                        timelineDays <= 7 || 
                                                        (timelineDays === 15 && index % 2 === 0) || 
                                                        (timelineDays === 30 && index % 5 === 0) ||
                                                        index === chartData.length - 1;
                                                    
                                                    return (
                                                        <span key={d.id} className={showLabel ? "transition-opacity" : "opacity-0 select-none pointer-events-none"}>
                                                            {new Date(d.date).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                                                        </span>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex-grow flex items-center justify-center text-sm text-tx-muted italic">
                                            Need at least 2 days of tracking logs to show trend chart.
                                        </div>
                                    )}
                                </div>

                                {/* Referrers List */}
                                <div className="bg-surface border border-bd/45 rounded-2xl p-6 flex flex-col justify-between">
                                    <div>
                                        <h3 className="font-bold font-outfit text-base mb-1">Top Referrers</h3>
                                        <p className="text-xs text-tx-muted">Visitor source attribution</p>
                                    </div>

                                    <div className="space-y-3 mt-4 flex-1">
                                        {referrers.length > 0 ? (
                                            referrers.map((ref, idx) => (
                                                <div key={idx} className="flex justify-between items-center">
                                                    <span className="text-sm text-tx-muted font-medium truncate max-w-[150px]">{ref.label}</span>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs font-semibold px-2 py-0.5 bg-background border border-bd/35 rounded text-tx-muted">
                                                            {ref.value}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-xs text-tx-muted italic py-10 text-center">No referrer data collected yet.</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Secondary insights: Browser & Device breakdown */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Browsers */}
                                <div className="bg-surface border border-bd/45 rounded-2xl p-6">
                                    <h3 className="font-bold font-outfit text-base mb-4">Browsers Share</h3>
                                    <div className="space-y-4">
                                        {browsers.length > 0 ? (
                                            browsers.map((b, idx) => {
                                                const total = browsers.reduce((sum, curr) => sum + curr.value, 0);
                                                const percentage = Math.round((b.value / total) * 100);
                                                return (
                                                    <div key={idx} className="space-y-1.5">
                                                        <div className="flex justify-between text-xs font-medium">
                                                            <span>{b.label}</span>
                                                            <span className="text-tx-muted">{b.value} ({percentage}%)</span>
                                                        </div>
                                                        <div className="w-full h-2 bg-background border border-bd/30 rounded-full overflow-hidden">
                                                            <div className="h-full bg-accent rounded-full" style={{ width: `${percentage}%` }} />
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        ) : (
                                            <p className="text-xs text-tx-muted italic py-6 text-center">No browser statistics available.</p>
                                        )}
                                    </div>
                                </div>

                                {/* Devices */}
                                <div className="bg-surface border border-bd/45 rounded-2xl p-6">
                                    <h3 className="font-bold font-outfit text-base mb-4">Platforms / Devices</h3>
                                    <div className="space-y-4">
                                        {devices.length > 0 ? (
                                            devices.map((d, idx) => {
                                                const total = devices.reduce((sum, curr) => sum + curr.value, 0);
                                                const percentage = Math.round((d.value / total) * 100);
                                                return (
                                                    <div key={idx} className="space-y-1.5">
                                                        <div className="flex justify-between text-xs font-medium">
                                                            <span>{d.label}</span>
                                                            <span className="text-tx-muted">{d.value} ({percentage}%)</span>
                                                        </div>
                                                        <div className="w-full h-2 bg-background border border-bd/30 rounded-full overflow-hidden">
                                                            <div className="h-full bg-secondary rounded-full" style={{ width: `${percentage}%` }} />
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        ) : (
                                            <p className="text-xs text-tx-muted italic py-6 text-center">No platform statistics available.</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ───────────────── MESSAGES TAB ───────────────── */}
                    {activeTab === "messages" && (
                        <div className="bg-surface border border-bd/45 rounded-2xl overflow-hidden animate-fade-in">
                            {/* Toolbar controls */}
                            <div className="p-5 border-b border-bd/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <h3 className="font-bold font-outfit text-base">Inbox Messages</h3>
                                    <span className="text-xs font-semibold bg-accent/15 text-accent px-2 py-0.5 rounded-full border border-accent/20">
                                        {messages.length} total
                                    </span>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                                    {/* Search */}
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="Search sender, email, content..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full bg-background border border-bd/50 rounded-xl pl-9 pr-4 py-2 text-sm text-tx-main focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
                                        />
                                        <svg className="w-4 h-4 text-tx-muted absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                                    </div>

                                    {/* Filters */}
                                    <div className="flex bg-background border border-bd/45 rounded-xl p-1 shrink-0">
                                        {["all", "read", "unread"].map((f) => (
                                            <button
                                                key={f}
                                                onClick={() => setMessageFilter(f)}
                                                className={`px-3 py-1 text-xs font-medium capitalize rounded-lg transition-all ${
                                                    messageFilter === f
                                                        ? "bg-surface text-accent shadow-sm"
                                                        : "text-tx-muted hover:text-tx-main"
                                                }`}
                                            >
                                                {f}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Message items grid/list */}
                            <div className="divide-y divide-bd/15">
                                {filteredMessages.length > 0 ? (
                                    filteredMessages.map((msg) => (
                                        <div
                                            key={msg.id}
                                            onClick={() => handleOpenMessage(msg)}
                                            className={`p-6 transition-all hover:bg-background/40 cursor-pointer ${
                                                msg.status === 'unread' ? 'bg-accent/[0.02]' : ''
                                            }`}
                                        >
                                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-3">
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h4 className="font-bold text-tx-main text-sm">{msg.name}</h4>
                                                        {msg.status === 'unread' && (
                                                            <span className="w-2 h-2 rounded-full bg-accent shrink-0 animate-pulse" />
                                                        )}
                                                    </div>
                                                    <a 
                                                        href={getMailtoLink(msg)} 
                                                        onClick={(e) => e.stopPropagation()} 
                                                        className="text-xs text-accent hover:underline"
                                                    >
                                                        {msg.email}
                                                    </a>
                                                </div>
                                                <span className="text-xs text-tx-muted">
                                                    {msg.timestamp?.toDate().toLocaleString(undefined, {
                                                        month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
                                                    }) || 'Just now'}
                                                </span>
                                            </div>

                                            <p className="text-tx-muted text-sm leading-relaxed mb-4 whitespace-pre-wrap">{msg.message}</p>

                                            <div className="flex items-center gap-3">
                                                {msg.status === 'unread' && (
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleMarkAsRead(msg.id); }}
                                                        className="text-xs font-bold text-accent hover:underline flex items-center gap-1"
                                                    >
                                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
                                                        Mark Read
                                                    </button>
                                                )}
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleDeleteMessage(msg.id); }}
                                                    className="text-xs font-bold text-red-500/70 hover:text-red-500 transition-colors flex items-center gap-1"
                                                >
                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="py-24 text-center text-tx-muted flex flex-col items-center justify-center">
                                        <div className="w-12 h-12 bg-background border border-bd/35 rounded-full flex items-center justify-center mb-4">
                                            <svg className="w-5 h-5 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                                        </div>
                                        <p className="font-semibold text-sm">No matching messages</p>
                                        <p className="text-xs opacity-75 mt-1">Try clearing your search query or filters.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* ───────────────── SESSIONS TAB ───────────────── */}
                    {activeTab === "sessions" && (
                        <div className="bg-surface border border-bd/45 rounded-2xl overflow-hidden animate-fade-in">
                            <div className="p-5 border-b border-bd/30 flex justify-between items-center">
                                <div>
                                    <h3 className="font-bold font-outfit text-base">Visitor Sessions Log</h3>
                                    <p className="text-xs text-tx-muted">Real-time incoming connection logs from your audiences</p>
                                </div>
                                <span className="text-xs font-semibold bg-secondary/15 text-secondary px-2.5 py-0.5 rounded-full border border-secondary/20">
                                    {visitLogs.length} entries
                                </span>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-bd/35 bg-background/30 text-[10px] uppercase tracking-wider font-semibold text-tx-muted">
                                            <th className="py-3 px-5">Time</th>
                                            <th className="py-3 px-5">Browser</th>
                                            <th className="py-3 px-5">Device / OS</th>
                                            <th className="py-3 px-5">Referrer</th>
                                            <th className="py-3 px-5">Language</th>
                                            <th className="py-3 px-5">Screen</th>
                                            <th className="py-3 px-5 text-right">Visitor Type</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-bd/15 text-sm">
                                        {visitLogs.length > 0 ? (
                                            visitLogs.slice(0, 100).map((log, idx) => (
                                                <tr key={idx} className="hover:bg-background/40 transition-colors">
                                                    <td className="py-3.5 px-5 text-xs text-tx-muted whitespace-nowrap">
                                                        {new Date(log.time).toLocaleString()}
                                                    </td>
                                                    <td className="py-3.5 px-5 font-medium whitespace-nowrap">{log.browser}</td>
                                                    <td className="py-3.5 px-5 text-tx-muted whitespace-nowrap">{log.device}</td>
                                                    <td className="py-3.5 px-5 text-xs text-accent whitespace-nowrap">{log.referrer || "Direct/Search"}</td>
                                                    <td className="py-3.5 px-5 text-xs text-tx-muted whitespace-nowrap">{log.language}</td>
                                                    <td className="py-3.5 px-5 text-xs text-tx-muted whitespace-nowrap">{log.screen || "Unknown"}</td>
                                                    <td className="py-3.5 px-5 text-right whitespace-nowrap">
                                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                                            log.isNewVisitor 
                                                                ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" 
                                                                : "bg-blue-500/10 text-blue-500 border border-blue-500/20"
                                                        }`}>
                                                            {log.isNewVisitor ? "New" : "Returning"}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="7" className="py-20 text-center text-tx-muted italic">
                                                    No visitor sessions recorded yet.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* ───────────────── CMS / MANAGE DATA TAB ───────────────── */}
                    {activeTab === "data" && (
                        <div className="bg-surface border border-bd/45 rounded-2xl p-6 md:p-8 animate-fade-in">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-bd/30 pb-6 mb-6 gap-4">
                                <div>
                                    <h3 className="font-bold font-outfit text-lg">Manage Content CMS</h3>
                                    <p className="text-xs text-tx-muted mt-0.5">Customize your portfolio text details, projects, skills, and education</p>
                                </div>

                                <div className="flex items-center gap-3 w-full md:w-auto">
                                    {cmsSaveMsg && (
                                        <span className="text-xs font-semibold text-accent bg-accent/15 px-3 py-1.5 rounded-xl border border-accent/20 animate-pulse">
                                            {cmsSaveMsg}
                                        </span>
                                    )}
                                    <button
                                        onClick={handleCmsSave}
                                        disabled={isSaving}
                                        className="w-full md:w-auto px-6 py-2.5 bg-accent hover:bg-accent-hover text-white rounded-xl text-xs font-bold shadow-lg shadow-accent/20 transition-all flex items-center justify-center gap-2"
                                    >
                                        {isSaving ? (
                                            <>
                                                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                Saving...
                                            </>
                                        ) : "Publish Changes"}
                                    </button>
                                </div>
                            </div>

                            {/* Section Switcher Tabs */}
                            <div className="flex border-b border-bd/30 mb-8 overflow-x-auto gap-4 custom-scrollbar">
                                {[
                                    { id: "profile", label: "Profile details" },
                                    { id: "projects", label: "Projects list" },
                                    { id: "skills", label: "Skills inventory" },
                                    { id: "education", label: "Education entries" }
                                ].map((sec) => (
                                    <button
                                        key={sec.id}
                                        onClick={() => setActiveCmsSec(sec.id)}
                                        className={`pb-3 text-xs font-semibold whitespace-nowrap border-b-2 transition-all ${
                                            activeCmsSec === sec.id
                                                ? "border-accent text-accent"
                                                : "border-transparent text-tx-muted hover:text-tx-main"
                                        }`}
                                    >
                                        {sec.label}
                                    </button>
                                ))}
                            </div>

                            {/* profile editor form */}
                            {activeCmsSec === "profile" && cmsProfile && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
                                    <div className="space-y-4">
                                        <h4 className="text-xs font-bold text-tx-muted uppercase tracking-wider">Contact Profile Details</h4>
                                        <div>
                                            <label className="block text-xs font-semibold text-tx-main mb-1.5">Full Name</label>
                                            <input
                                                type="text"
                                                value={cmsProfile.name || ""}
                                                onChange={(e) => setCmsProfile({ ...cmsProfile, name: e.target.value })}
                                                className="w-full bg-background border border-bd/50 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/20"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-tx-main mb-1.5">Professional Title</label>
                                            <input
                                                type="text"
                                                value={cmsProfile.title || ""}
                                                onChange={(e) => setCmsProfile({ ...cmsProfile, title: e.target.value })}
                                                className="w-full bg-background border border-bd/50 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/20"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-tx-main mb-1.5">Brief Intro (Hero Section)</label>
                                            <textarea
                                                rows="3"
                                                value={cmsProfile.bio || ""}
                                                onChange={(e) => setCmsProfile({ ...cmsProfile, bio: e.target.value })}
                                                className="w-full bg-background border border-bd/50 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 resize-y"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-tx-main mb-1.5">Contact Email Address</label>
                                            <input
                                                type="email"
                                                value={cmsProfile.email || ""}
                                                onChange={(e) => setCmsProfile({ ...cmsProfile, email: e.target.value })}
                                                className="w-full bg-background border border-bd/50 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/20"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-tx-main mb-1.5">Footer Email Address</label>
                                            <input
                                                type="email"
                                                value={cmsProfile.emailFooter || ""}
                                                onChange={(e) => setCmsProfile({ ...cmsProfile, emailFooter: e.target.value })}
                                                className="w-full bg-background border border-bd/50 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/20"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-tx-main mb-1.5">Phone Number</label>
                                            <input
                                                type="text"
                                                value={cmsProfile.phone || ""}
                                                onChange={(e) => setCmsProfile({ ...cmsProfile, phone: e.target.value })}
                                                className="w-full bg-background border border-bd/50 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/20"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h4 className="text-xs font-bold text-tx-muted uppercase tracking-wider">About Section Copy & Links</h4>
                                        <div>
                                            <label className="block text-xs font-semibold text-tx-main mb-1.5">About Section Heading</label>
                                            <input
                                                type="text"
                                                value={cmsProfile.aboutHeading || ""}
                                                onChange={(e) => setCmsProfile({ ...cmsProfile, aboutHeading: e.target.value })}
                                                className="w-full bg-background border border-bd/50 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/20"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-tx-main mb-1.5">About Text Block 1</label>
                                            <textarea
                                                rows="3"
                                                value={cmsProfile.aboutText1 || ""}
                                                onChange={(e) => setCmsProfile({ ...cmsProfile, aboutText1: e.target.value })}
                                                className="w-full bg-background border border-bd/50 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 resize-y"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-tx-main mb-1.5">About Text Block 2</label>
                                            <textarea
                                                rows="3"
                                                value={cmsProfile.aboutText2 || ""}
                                                onChange={(e) => setCmsProfile({ ...cmsProfile, aboutText2: e.target.value })}
                                                className="w-full bg-background border border-bd/50 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 resize-y"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-tx-main mb-1.5">LinkedIn Profile Link</label>
                                            <input
                                                type="text"
                                                value={cmsProfile.linkedin || ""}
                                                onChange={(e) => setCmsProfile({ ...cmsProfile, linkedin: e.target.value })}
                                                className="w-full bg-background border border-bd/50 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/20"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-tx-main mb-1.5">GitHub Profile Link</label>
                                            <input
                                                type="text"
                                                value={cmsProfile.github || ""}
                                                onChange={(e) => setCmsProfile({ ...cmsProfile, github: e.target.value })}
                                                className="w-full bg-background border border-bd/50 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/20"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-tx-main mb-1.5">LeetCode Link</label>
                                            <input
                                                type="text"
                                                value={cmsProfile.leetcode || ""}
                                                onChange={(e) => setCmsProfile({ ...cmsProfile, leetcode: e.target.value })}
                                                className="w-full bg-background border border-bd/50 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/20"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-tx-main mb-1.5">Resume PDF URL Path</label>
                                            <input
                                                type="text"
                                                value={cmsProfile.resumeUrl || ""}
                                                onChange={(e) => setCmsProfile({ ...cmsProfile, resumeUrl: e.target.value })}
                                                className="w-full bg-background border border-bd/50 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/20"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* projects editor form */}
                            {activeCmsSec === "projects" && (
                                <div className="space-y-8 animate-fade-in">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                                        {/* Current list */}
                                        <div className="space-y-4">
                                            <h4 className="text-xs font-bold text-tx-muted uppercase tracking-wider">Current Projects ({cmsProjects.length})</h4>
                                            {cmsProjects.map((p, index) => (
                                                <div key={index} className="bg-background border border-bd/45 p-4 rounded-xl flex flex-col gap-3">
                                                    {editingProjectIdx === index ? (
                                                        <div className="space-y-3 w-full">
                                                            <input
                                                                type="text"
                                                                value={editingProjectData.title}
                                                                onChange={(e) => setEditingProjectData({ ...editingProjectData, title: e.target.value })}
                                                                className="w-full bg-surface border border-bd/50 rounded-lg px-3 py-1.5 text-xs text-tx-main font-bold"
                                                                placeholder="Title"
                                                            />
                                                            <textarea
                                                                rows="2"
                                                                value={editingProjectData.description}
                                                                onChange={(e) => setEditingProjectData({ ...editingProjectData, description: e.target.value })}
                                                                className="w-full bg-surface border border-bd/50 rounded-lg px-3 py-1.5 text-xs text-tx-main"
                                                                placeholder="Description"
                                                            />
                                                            <input
                                                                type="text"
                                                                value={editingProjectData.tags}
                                                                onChange={(e) => setEditingProjectData({ ...editingProjectData, tags: e.target.value })}
                                                                className="w-full bg-surface border border-bd/50 rounded-lg px-3 py-1.5 text-xs text-tx-main"
                                                                placeholder="Tags (Comma separated)"
                                                            />
                                                            <input
                                                                type="text"
                                                                value={editingProjectData.image}
                                                                onChange={(e) => setEditingProjectData({ ...editingProjectData, image: e.target.value })}
                                                                className="w-full bg-surface border border-bd/50 rounded-lg px-3 py-1.5 text-xs text-tx-main"
                                                                placeholder="Image URLs (Comma separated)"
                                                            />
                                                            <div className="grid grid-cols-2 gap-2">
                                                                <input
                                                                    type="text"
                                                                    value={editingProjectData.github}
                                                                    onChange={(e) => setEditingProjectData({ ...editingProjectData, github: e.target.value })}
                                                                    className="w-full bg-surface border border-bd/50 rounded-lg px-3 py-1.5 text-xs text-tx-main"
                                                                    placeholder="GitHub URL"
                                                                />
                                                                <input
                                                                    type="text"
                                                                    value={editingProjectData.link}
                                                                    onChange={(e) => setEditingProjectData({ ...editingProjectData, link: e.target.value })}
                                                                    className="w-full bg-surface border border-bd/50 rounded-lg px-3 py-1.5 text-xs text-tx-main"
                                                                    placeholder="Live URL"
                                                                />
                                                            </div>
                                                            <div className="flex justify-end gap-2 pt-2">
                                                                <button
                                                                    onClick={() => setEditingProjectIdx(null)}
                                                                    className="px-3 py-1.5 bg-surface hover:bg-surface/80 rounded-lg text-xs font-bold"
                                                                >
                                                                    Cancel
                                                                </button>
                                                                <button
                                                                    onClick={() => {
                                                                        const updated = [...cmsProjects];
                                                                        const tagsArr = typeof editingProjectData.tags === 'string'
                                                                            ? editingProjectData.tags.split(",").map(t => t.trim()).filter(Boolean)
                                                                            : editingProjectData.tags;
                                                                        updated[index] = { ...editingProjectData, tags: tagsArr };
                                                                        setCmsProjects(updated);
                                                                        setEditingProjectIdx(null);
                                                                    }}
                                                                    className="px-3.5 py-1.5 bg-accent text-white rounded-lg text-xs font-bold"
                                                                >
                                                                    Save
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="flex justify-between items-center gap-3 w-full">
                                                            <div>
                                                                <h5 className="font-bold text-sm text-tx-main">{p.title}</h5>
                                                                <p className="text-xs text-tx-muted truncate max-w-[200px]">{p.description}</p>
                                                            </div>
                                                            <div className="flex gap-2 shrink-0">
                                                                <button
                                                                    onClick={() => {
                                                                        setEditingProjectIdx(index);
                                                                        setEditingProjectData({
                                                                            title: p.title || "",
                                                                            description: p.description || "",
                                                                            tags: Array.isArray(p.tags) ? p.tags.join(", ") : "",
                                                                            image: p.image || "",
                                                                            link: p.link || "",
                                                                            github: p.github || ""
                                                                        });
                                                                    }}
                                                                    className="px-2.5 py-1.5 bg-accent/10 text-accent hover:bg-accent hover:text-white rounded-lg text-xs font-bold transition-all"
                                                                >
                                                                    Edit
                                                                </button>
                                                                <button
                                                                    onClick={() => {
                                                                        const updated = cmsProjects.filter((_, idx) => idx !== index);
                                                                        setCmsProjects(updated);
                                                                    }}
                                                                    className="px-2.5 py-1.5 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg text-xs font-bold transition-all"
                                                                >
                                                                    Remove
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>

                                        {/* Add new project */}
                                        <div className="bg-background/40 border border-bd/45 p-6 rounded-2xl space-y-4">
                                            <h4 className="text-xs font-bold text-tx-muted uppercase tracking-wider">Add New Project Card</h4>
                                            <div>
                                                <label className="block text-[11px] font-bold text-tx-muted uppercase tracking-wider mb-1">Project Title</label>
                                                <input
                                                    type="text"
                                                    value={newProject.title}
                                                    onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                                                    className="w-full bg-background border border-bd/50 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/20"
                                                    placeholder="E.g. Attendence Tracker"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-bold text-tx-muted uppercase tracking-wider mb-1">Description</label>
                                                <textarea
                                                    rows="2"
                                                    value={newProject.description}
                                                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                                                    className="w-full bg-background border border-bd/50 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/20"
                                                    placeholder="Write short description..."
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-bold text-tx-muted uppercase tracking-wider mb-1">Tags (Comma separated)</label>
                                                <input
                                                    type="text"
                                                    value={newProject.tags}
                                                    onChange={(e) => setNewProject({ ...newProject, tags: e.target.value })}
                                                    className="w-full bg-background border border-bd/50 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/20"
                                                    placeholder="React, Django, Python"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-bold text-tx-muted uppercase tracking-wider mb-1">Image URLs (Comma separated)</label>
                                                <input
                                                    type="text"
                                                    value={newProject.image}
                                                    onChange={(e) => setNewProject({ ...newProject, image: e.target.value })}
                                                    className="w-full bg-background border border-bd/50 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/20"
                                                    placeholder="/images/projects/p1.png"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-bold text-tx-muted uppercase tracking-wider mb-1">GitHub Link</label>
                                                <input
                                                    type="text"
                                                    value={newProject.github}
                                                    onChange={(e) => setNewProject({ ...newProject, github: e.target.value })}
                                                    className="w-full bg-background border border-bd/50 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/20"
                                                    placeholder="https://github.com/..."
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-bold text-tx-muted uppercase tracking-wider mb-1">Live URL (Use '#' if none)</label>
                                                <input
                                                    type="text"
                                                    value={newProject.link}
                                                    onChange={(e) => setNewProject({ ...newProject, link: e.target.value })}
                                                    className="w-full bg-background border border-bd/50 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/20"
                                                    placeholder="#"
                                                />
                                            </div>
                                            <button
                                                onClick={() => {
                                                    if (!newProject.title) return alert("Title is required!");
                                                    const tagsArr = newProject.tags.split(",").map(t => t.trim()).filter(Boolean);
                                                    setCmsProjects([...cmsProjects, { ...newProject, tags: tagsArr }]);
                                                    setNewProject({ title: "", description: "", tags: "", image: "", link: "", github: "" });
                                                }}
                                                className="w-full py-2 bg-secondary hover:bg-secondary/90 text-white rounded-xl text-xs font-bold transition-all"
                                            >
                                                Insert Project
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* skills editor form */}
                            {activeCmsSec === "skills" && (
                                <div className="space-y-8 animate-fade-in">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                                        {/* Current list of skill categories */}
                                        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {cmsSkills.map((grp, index) => (
                                                <div key={index} className="bg-background border border-bd/45 p-5 rounded-2xl relative group">
                                                    {editingSkillIdx === index ? (
                                                        <div className="space-y-3">
                                                            <input
                                                                type="text"
                                                                value={editingSkillData.category}
                                                                onChange={(e) => setEditingSkillData({ ...editingSkillData, category: e.target.value })}
                                                                className="w-full bg-surface border border-bd/50 rounded-lg px-2.5 py-1.5 text-xs text-tx-main font-bold"
                                                                placeholder="Category Title"
                                                            />
                                                            <input
                                                                type="text"
                                                                value={editingSkillData.items}
                                                                onChange={(e) => setEditingSkillData({ ...editingSkillData, items: e.target.value })}
                                                                className="w-full bg-surface border border-bd/50 rounded-lg px-2.5 py-1.5 text-xs text-tx-main"
                                                                placeholder="Skills (Comma separated)"
                                                            />
                                                            <div className="flex justify-end gap-2 pt-1">
                                                                <button
                                                                    onClick={() => setEditingSkillIdx(null)}
                                                                    className="px-2.5 py-1 bg-surface hover:bg-surface/80 rounded-lg text-xs font-bold"
                                                                >
                                                                    Cancel
                                                                </button>
                                                                <button
                                                                    onClick={() => {
                                                                        const updated = [...cmsSkills];
                                                                        const itemsArr = typeof editingSkillData.items === 'string'
                                                                            ? editingSkillData.items.split(",").map(t => t.trim()).filter(Boolean)
                                                                            : editingSkillData.items;
                                                                        updated[index] = { category: editingSkillData.category, items: itemsArr };
                                                                        setCmsSkills(updated);
                                                                        setEditingSkillIdx(null);
                                                                    }}
                                                                    className="px-3 py-1 bg-accent text-white rounded-lg text-xs font-bold"
                                                                >
                                                                    Save
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <div className="flex justify-between items-start gap-2 mb-3">
                                                                <h5 className="font-bold text-sm text-tx-main pr-16">{grp.category}</h5>
                                                                <div className="flex gap-2 shrink-0">
                                                                    <button
                                                                        onClick={() => {
                                                                            setEditingSkillIdx(index);
                                                                            setEditingSkillData({
                                                                                category: grp.category,
                                                                                items: grp.items.join(", ")
                                                                            });
                                                                        }}
                                                                        className="text-xs font-bold text-accent hover:underline"
                                                                    >
                                                                        Edit
                                                                    </button>
                                                                    <button
                                                                        onClick={() => {
                                                                            const updated = cmsSkills.filter((_, idx) => idx !== index);
                                                                            setCmsSkills(updated);
                                                                        }}
                                                                        className="text-xs font-bold text-red-500 hover:underline"
                                                                    >
                                                                        Remove
                                                                    </button>
                                                                </div>
                                                            </div>
                                                            <div className="flex flex-wrap gap-1.5">
                                                                {grp.items.map((it, idx) => (
                                                                    <span
                                                                        key={idx}
                                                                        onClick={() => {
                                                                            const updatedItems = grp.items.filter((_, i) => i !== idx);
                                                                            const updatedGroup = { ...grp, items: updatedItems };
                                                                            const updatedList = [...cmsSkills];
                                                                            updatedList[index] = updatedGroup;
                                                                            setCmsSkills(updatedList);
                                                                        }}
                                                                        className="text-xs px-2 py-1 bg-surface border border-bd/40 text-tx-muted hover:text-red-500 hover:border-red-500/30 rounded cursor-pointer select-none"
                                                                        title="Click to delete tag"
                                                                    >
                                                                        {it} &times;
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            ))}
                                        </div>

                                        {/* Add new Category */}
                                        <div className="bg-background/40 border border-bd/45 p-6 rounded-2xl space-y-4">
                                            <h4 className="text-xs font-bold text-tx-muted uppercase tracking-wider">Create Skills Category</h4>
                                            <div>
                                                <label className="block text-[11px] font-bold text-tx-muted uppercase tracking-wider mb-1">Category Title</label>
                                                <input
                                                    type="text"
                                                    value={newSkillGroup.category}
                                                    onChange={(e) => setNewSkillGroup({ ...newSkillGroup, category: e.target.value })}
                                                    className="w-full bg-background border border-bd/50 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/20"
                                                    placeholder="E.g. Backend Tools"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-bold text-tx-muted uppercase tracking-wider mb-1">Skill Tags (Comma separated)</label>
                                                <input
                                                    type="text"
                                                    value={newSkillGroup.items}
                                                    onChange={(e) => setNewSkillGroup({ ...newSkillGroup, items: e.target.value })}
                                                    className="w-full bg-background border border-bd/50 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/20"
                                                    placeholder="Docker, Kubernetes, AWS"
                                                />
                                            </div>
                                            <button
                                                onClick={() => {
                                                    if (!newSkillGroup.category) return alert("Category title required!");
                                                    const itemsArr = newSkillGroup.items.split(",").map(i => i.trim()).filter(Boolean);
                                                    setCmsSkills([...cmsSkills, { category: newSkillGroup.category, items: itemsArr }]);
                                                    setNewSkillGroup({ category: "", items: "" });
                                                }}
                                                className="w-full py-2 bg-secondary hover:bg-secondary/90 text-white rounded-xl text-xs font-bold transition-all"
                                            >
                                                Insert Skill Category
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* education editor form */}
                            {activeCmsSec === "education" && (
                                <div className="space-y-8 animate-fade-in">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                                        {/* Current list */}
                                        <div className="space-y-4">
                                            <h4 className="text-xs font-bold text-tx-muted uppercase tracking-wider">Current Entries ({cmsEducation.length})</h4>
                                            {cmsEducation.map((edu, index) => (
                                                <div key={index} className="bg-background border border-bd/45 p-5 rounded-2xl flex flex-col gap-3">
                                                    {editingEduIdx === index ? (
                                                        <div className="space-y-3 w-full">
                                                            <input
                                                                type="text"
                                                                value={editingEduData.degree}
                                                                onChange={(e) => setEditingEduData({ ...editingEduData, degree: e.target.value })}
                                                                className="w-full bg-surface border border-bd/50 rounded-lg px-3 py-1.5 text-xs text-tx-main font-bold"
                                                                placeholder="Degree Title"
                                                            />
                                                            <input
                                                                type="text"
                                                                value={editingEduData.school}
                                                                onChange={(e) => setEditingEduData({ ...editingEduData, school: e.target.value })}
                                                                className="w-full bg-surface border border-bd/50 rounded-lg px-3 py-1.5 text-xs text-tx-main"
                                                                placeholder="School/University"
                                                            />
                                                            <input
                                                                type="text"
                                                                value={editingEduData.date}
                                                                onChange={(e) => setEditingEduData({ ...editingEduData, date: e.target.value })}
                                                                className="w-full bg-surface border border-bd/50 rounded-lg px-3 py-1.5 text-xs text-tx-main"
                                                                placeholder="Dates"
                                                            />
                                                            <textarea
                                                                rows="2"
                                                                value={editingEduData.bullets}
                                                                onChange={(e) => setEditingEduData({ ...editingEduData, bullets: e.target.value })}
                                                                className="w-full bg-surface border border-bd/50 rounded-lg px-3 py-1.5 text-xs text-tx-main"
                                                                placeholder="Bullet Points (one per line)"
                                                            />
                                                            <div className="flex justify-end gap-2 pt-1">
                                                                <button
                                                                    onClick={() => setEditingEduIdx(null)}
                                                                    className="px-3 py-1.5 bg-surface hover:bg-surface/80 rounded-lg text-xs font-bold"
                                                                >
                                                                    Cancel
                                                                </button>
                                                                <button
                                                                    onClick={() => {
                                                                        const updated = [...cmsEducation];
                                                                        const bulletsArr = typeof editingEduData.bullets === 'string'
                                                                            ? editingEduData.bullets.split("\n").map(b => b.trim()).filter(Boolean)
                                                                            : editingEduData.bullets;
                                                                        updated[index] = { ...editingEduData, bullets: bulletsArr };
                                                                        setCmsEducation(updated);
                                                                        setEditingEduIdx(null);
                                                                    }}
                                                                    className="px-3.5 py-1.5 bg-accent text-white rounded-lg text-xs font-bold"
                                                                >
                                                                    Save
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="flex justify-between items-start gap-4 w-full">
                                                            <div className="flex-grow">
                                                                <h5 className="font-bold text-sm text-tx-main">{edu.degree}</h5>
                                                                <p className="text-xs text-accent font-semibold">{edu.date}</p>
                                                                <p className="text-xs text-tx-muted mt-1">{edu.school}</p>
                                                                {edu.bullets && edu.bullets.length > 0 && (
                                                                    <ul className="list-disc ml-4 text-[10px] text-tx-muted mt-2 space-y-0.5">
                                                                        {edu.bullets.map((b, i) => <li key={i}>{b}</li>)}
                                                                    </ul>
                                                                )}
                                                            </div>
                                                            <div className="flex gap-2 shrink-0">
                                                                <button
                                                                    onClick={() => {
                                                                        setEditingEduIdx(index);
                                                                        setEditingEduData({
                                                                            degree: edu.degree || "",
                                                                            school: edu.school || "",
                                                                            date: edu.date || "",
                                                                            bullets: Array.isArray(edu.bullets) ? edu.bullets.join("\n") : ""
                                                                        });
                                                                    }}
                                                                    className="px-2.5 py-1.5 bg-accent/10 text-accent hover:bg-accent hover:text-white rounded-lg text-xs font-bold transition-all"
                                                                >
                                                                    Edit
                                                                </button>
                                                                <button
                                                                    onClick={() => {
                                                                        const updated = cmsEducation.filter((_, idx) => idx !== index);
                                                                        setCmsEducation(updated);
                                                                    }}
                                                                    className="px-2.5 py-1.5 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg text-xs font-bold transition-all"
                                                                >
                                                                    Remove
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>

                                        {/* Add new education */}
                                        <div className="bg-background/40 border border-bd/45 p-6 rounded-2xl space-y-4">
                                            <h4 className="text-xs font-bold text-tx-muted uppercase tracking-wider">Add Education Entry</h4>
                                            <div>
                                                <label className="block text-[11px] font-bold text-tx-muted uppercase tracking-wider mb-1">Degree Title</label>
                                                <input
                                                    type="text"
                                                    value={newEdu.degree}
                                                    onChange={(e) => setNewEdu({ ...newEdu, degree: e.target.value })}
                                                    className="w-full bg-background border border-bd/50 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/20"
                                                    placeholder="B.Tech, Intermediate, High School"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-bold text-tx-muted uppercase tracking-wider mb-1">School / University</label>
                                                <input
                                                    type="text"
                                                    value={newEdu.school}
                                                    onChange={(e) => setNewEdu({ ...newEdu, school: e.target.value })}
                                                    className="w-full bg-background border border-bd/50 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/20"
                                                    placeholder="School name, City"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-bold text-tx-muted uppercase tracking-wider mb-1">Date Range</label>
                                                <input
                                                    type="text"
                                                    value={newEdu.date}
                                                    onChange={(e) => setNewEdu({ ...newEdu, date: e.target.value })}
                                                    className="w-full bg-background border border-bd/50 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/20"
                                                    placeholder="E.g. 2023 - 2027"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-bold text-tx-muted uppercase tracking-wider mb-1">Bullet points (Comma separated)</label>
                                                <textarea
                                                    rows="3"
                                                    value={newEdu.bullets}
                                                    onChange={(e) => setNewEdu({ ...newEdu, bullets: e.target.value })}
                                                    className="w-full bg-background border border-bd/50 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/20"
                                                    placeholder="Point 1, Point 2, Point 3"
                                                />
                                            </div>
                                            <button
                                                onClick={() => {
                                                    if (!newEdu.degree || !newEdu.school) return alert("Degree & school required!");
                                                    const bulletsArr = newEdu.bullets.split(",").map(b => b.trim()).filter(Boolean);
                                                    setCmsEducation([...cmsEducation, { ...newEdu, bullets: bulletsArr }]);
                                                    setNewEdu({ degree: "", school: "", date: "", bullets: "" });
                                                }}
                                                className="w-full py-2 bg-secondary hover:bg-secondary/90 text-white rounded-xl text-xs font-bold transition-all"
                                            >
                                                Insert Education
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </main>
            </div>

            {/* Message Details Modal */}
            {selectedMessage && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-surface border border-bd/45 rounded-2xl w-full max-w-lg p-6 md:p-8 relative shadow-2xl animate-fade-in text-tx-main">
                        <button
                            onClick={() => setSelectedMessage(null)}
                            className="absolute top-4 right-4 p-2 text-tx-muted hover:text-tx-main rounded-xl hover:bg-background transition-colors"
                            aria-label="Close modal"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>

                        <h3 className="font-outfit font-bold text-lg mb-6 flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-accent inline-block" />
                            Message Details
                        </h3>

                        <div className="space-y-4 mb-6">
                            <div className="flex justify-between border-b border-bd/20 pb-2.5">
                                <span className="text-xs text-tx-muted font-medium">Sender:</span>
                                <span className="text-sm font-bold">{selectedMessage.name}</span>
                            </div>
                            <div className="flex justify-between border-b border-bd/20 pb-2.5">
                                <span className="text-xs text-tx-muted font-medium">Email:</span>
                                <a
                                    href={getMailtoLink(selectedMessage)}
                                    className="text-sm text-accent hover:underline font-semibold"
                                >
                                    {selectedMessage.email}
                                </a>
                            </div>
                            <div className="flex justify-between border-b border-bd/20 pb-2.5">
                                <span className="text-xs text-tx-muted font-medium">Received:</span>
                                <span className="text-xs text-tx-muted font-medium">
                                    {selectedMessage.timestamp?.toDate().toLocaleString(undefined, {
                                        month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
                                    }) || "Just now"}
                                </span>
                            </div>
                            <div className="pt-2">
                                <span className="block text-xs text-tx-muted font-medium mb-2">Message Content:</span>
                                <div className="bg-background border-l-4 border-accent p-4 rounded-r-xl max-h-56 overflow-y-auto whitespace-pre-wrap text-sm text-tx-muted leading-relaxed">
                                    {selectedMessage.message}
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-between items-center gap-3">
                            <button
                                onClick={async () => {
                                    if (window.confirm("Are you sure you want to delete this message?")) {
                                        await handleDeleteMessage(selectedMessage.id);
                                        setSelectedMessage(null);
                                    }
                                }}
                                className="px-4 py-2 bg-red-500/10 text-red-500 rounded-xl text-xs font-bold hover:bg-red-500 hover:text-white transition-all"
                            >
                                Delete Message
                            </button>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setSelectedMessage(null)}
                                    className="px-4 py-2 bg-background border border-bd/45 text-tx-muted rounded-xl text-xs font-bold hover:text-tx-main hover:bg-surface/50 transition-all"
                                >
                                    Close
                                </button>
                                <a
                                    href={getMailtoLink(selectedMessage)}
                                    className="px-5 py-2 bg-accent hover:bg-accent-hover text-white rounded-xl text-xs font-bold shadow-md shadow-accent/10 transition-all flex items-center gap-1.5"
                                >
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                                    Reply via Email
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const StatCard = ({ title, value, icon }) => {
    const getIconSvg = () => {
        if (icon === "visits") return <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>;
        if (icon === "visitors") return <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>;
        if (icon === "today") return <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>;
        if (icon === "today_unique") return <svg className="w-5 h-5 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>;
        return <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>;
    };

    return (
        <div className="bg-surface border border-bd/45 rounded-2xl p-5 flex flex-col justify-between min-h-[110px] shadow-sm animate-fade-in">
            <div className="flex justify-between items-center mb-2">
                <span className="text-[11px] font-bold text-tx-muted uppercase tracking-wider">{title}</span>
                <div className="w-7 h-7 rounded-lg bg-background flex items-center justify-center border border-bd/35">
                    {getIconSvg()}
                </div>
            </div>
            <p className="text-xl md:text-2xl font-extrabold font-outfit text-tx-main tracking-tight">
                {typeof value === 'number' ? value.toLocaleString() : value}
            </p>
        </div>
    );
};

export default AdminDashboard;

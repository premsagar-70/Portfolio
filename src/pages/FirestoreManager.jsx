import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
    collection,
    getDocs,
    doc,
    getDoc,
    setDoc,
    deleteDoc
} from "firebase/firestore";

const FirestoreManager = () => {
    const [collections] = useState(["analytics", "messages", "content"]);
    const [selectedCollection, setSelectedCollection] = useState("content");
    const [documents, setDocuments] = useState([]);
    const [selectedDocId, setSelectedDocId] = useState("");
    const [docFields, setDocFields] = useState([]); // array of { key, val, type }
    const [rawJson, setRawJson] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [theme, setTheme] = useState("dark");
    const [searchQuery, setSearchQuery] = useState("");
    const [statusMsg, setStatusMsg] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        // Detect theme
        const root = document.documentElement;
        setTheme(root.classList.contains("dark") ? "dark" : "light");

        const authUnsubscribe = onAuthStateChanged(auth, (user) => {
            if (!user) {
                navigate("/login");
            }
        });

        return () => authUnsubscribe();
    }, [navigate]);

    // Fetch documents inside selected collection
    useEffect(() => {
        const fetchDocs = async () => {
            setLoading(true);
            setDocuments([]);
            setSelectedDocId("");
            setDocFields([]);
            setRawJson("");
            try {
                const querySnapshot = await getDocs(collection(db, selectedCollection));
                const docsList = [];
                querySnapshot.forEach((doc) => {
                    docsList.push({
                        id: doc.id,
                        data: doc.data()
                    });
                });
                setDocuments(docsList);
            } catch (err) {
                console.error("Error fetching documents:", err);
                setStatusMsg("Permission denied reading collection.");
                setTimeout(() => setStatusMsg(""), 4000);
            } finally {
                setLoading(false);
            }
        };

        fetchDocs();
    }, [selectedCollection]);

    const handleSelectDoc = (docId, data) => {
        setSelectedDocId(docId);
        setRawJson(JSON.stringify(data, null, 2));

        // Parse object fields into tabular { key, val, type }
        const fieldsList = Object.entries(data).map(([key, val]) => {
            let type = "string";
            if (typeof val === "number") type = "number";
            else if (typeof val === "boolean") type = "boolean";
            else if (Array.isArray(val)) type = "array";
            else if (typeof val === "object" && val !== null) type = "object";

            return {
                key,
                val: type === "array" || type === "object" ? JSON.stringify(val) : val,
                type
            };
        });
        setDocFields(fieldsList);
    };

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

    const handleAddField = () => {
        setDocFields([...docFields, { key: "new_field_" + Date.now().toString(36), val: "", type: "string" }]);
    };

    const handleFieldChange = (index, property, value) => {
        const updated = [...docFields];
        updated[index][property] = value;
        setDocFields(updated);
    };

    const handleRemoveField = (index) => {
        setDocFields(docFields.filter((_, idx) => idx !== index));
    };

    // Save document edits back to Firestore
    const handleSaveDoc = async () => {
        if (!selectedDocId) return alert("Select a document first.");
        setSaving(true);
        try {
            const dataToSave = {};
            docFields.forEach(field => {
                let parsedVal = field.val;
                if (field.type === "number") {
                    parsedVal = Number(field.val);
                } else if (field.type === "boolean") {
                    parsedVal = field.val === "true" || field.val === true;
                } else if (field.type === "array" || field.type === "object") {
                    try {
                        parsedVal = JSON.parse(field.val);
                    } catch (e) {
                        parsedVal = field.val; // fallback to string representation if parsing fails
                    }
                }
                dataToSave[field.key] = parsedVal;
            });

            await setDoc(doc(db, selectedCollection, selectedDocId), dataToSave);
            setStatusMsg("Document saved successfully!");
            setTimeout(() => setStatusMsg(""), 3000);

            // Refresh document list
            const querySnapshot = await getDocs(collection(db, selectedCollection));
            const docsList = [];
            querySnapshot.forEach((doc) => {
                docsList.push({ id: doc.id, data: doc.data() });
            });
            setDocuments(docsList);
            setRawJson(JSON.stringify(dataToSave, null, 2));
        } catch (err) {
            console.error("Error saving document:", err);
            alert("Error writing to Firestore database: check permissions.");
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteDoc = async () => {
        if (!selectedDocId) return;
        if (window.confirm(`Are you sure you want to delete document "${selectedDocId}"?`)) {
            try {
                await deleteDoc(doc(db, selectedCollection, selectedDocId));
                setDocuments(documents.filter(d => d.id !== selectedDocId));
                setSelectedDocId("");
                setDocFields([]);
                setRawJson("");
                setStatusMsg("Document deleted.");
                setTimeout(() => setStatusMsg(""), 3000);
            } catch (err) {
                console.error("Error deleting doc:", err);
                alert("Permission denied deleting document.");
            }
        }
    };

    const handleCreateDoc = async () => {
        const docId = prompt("Enter new Document ID:");
        if (!docId) return;
        try {
            await setDoc(doc(db, selectedCollection, docId), { created_at: new Date().toISOString() });
            setStatusMsg("New document initialized.");
            setTimeout(() => setStatusMsg(""), 3000);

            // Reload doc list
            const querySnapshot = await getDocs(collection(db, selectedCollection));
            const docsList = [];
            querySnapshot.forEach((doc) => {
                docsList.push({ id: doc.id, data: doc.data() });
            });
            setDocuments(docsList);
        } catch (err) {
            alert("Error creating document. Check permissions.");
        }
    };

    const filteredDocs = documents.filter(doc => 
        doc.id.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="h-screen w-screen overflow-hidden bg-background text-tx-main font-sans flex flex-col">
            {/* Header */}
            <header className="h-16 bg-surface border-b border-bd/40 px-6 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate("/admin")}
                        className="p-1.5 rounded-lg hover:bg-background text-tx-muted hover:text-tx-main transition-colors"
                        aria-label="Back to dashboard"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                    </button>
                    <h1 className="font-outfit font-bold text-lg">Firestore Database Editor</h1>
                </div>

                <div className="flex items-center gap-3">
                    {statusMsg && (
                        <span className="text-xs font-semibold text-accent bg-accent/15 px-3 py-1 rounded-xl border border-accent/20">
                            {statusMsg}
                        </span>
                    )}
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-lg text-tx-muted hover:text-tx-main hover:bg-background transition-colors"
                        aria-label="Toggle theme"
                    >
                        {theme === "dark" ? (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707.707M12 8a4 4 0 100 8 4 4 0 000-8z"></path></svg>
                        ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
                        )}
                    </button>
                </div>
            </header>

            {/* Layout Panels */}
            <div className="flex-1 flex overflow-hidden">
                {/* Panel 1: Collections */}
                <div className="w-64 border-r border-bd/40 bg-surface/30 p-4 flex flex-col shrink-0">
                    <h2 className="text-[10px] font-bold text-tx-muted uppercase tracking-wider mb-4 px-2">Collections</h2>
                    <div className="space-y-1">
                        {collections.map(col => (
                            <button
                                key={col}
                                onClick={() => setSelectedCollection(col)}
                                className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                                    selectedCollection === col
                                        ? "bg-accent text-white shadow-md shadow-accent/15"
                                        : "text-tx-muted hover:text-tx-main hover:bg-surface"
                                }`}
                            >
                                {col}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Panel 2: Documents */}
                <div className="w-72 border-r border-bd/40 bg-surface/10 p-4 flex flex-col shrink-0">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-[10px] font-bold text-tx-muted uppercase tracking-wider px-2">Documents</h2>
                        <button
                            onClick={handleCreateDoc}
                            className="text-[10px] font-bold text-accent hover:underline"
                        >
                            + New Doc
                        </button>
                    </div>

                    {/* Search */}
                    <div className="relative mb-3">
                        <input
                            type="text"
                            placeholder="Filter documents..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-background border border-bd/40 rounded-xl pl-8 pr-3 py-1.5 text-xs focus:outline-none"
                        />
                        <svg className="w-3.5 h-3.5 text-tx-muted absolute left-2.5 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                        {loading ? (
                            <div className="text-center py-10 text-xs text-tx-muted italic">Loading...</div>
                        ) : filteredDocs.length > 0 ? (
                            filteredDocs.map(d => (
                                <button
                                    key={d.id}
                                    onClick={() => handleSelectDoc(d.id, d.data)}
                                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium truncate transition-all ${
                                        selectedDocId === d.id
                                            ? "bg-surface border border-bd/60 text-accent font-bold"
                                            : "text-tx-muted hover:text-tx-main hover:bg-surface/50 border border-transparent"
                                    }`}
                                >
                                    {d.id}
                                </button>
                            ))
                        ) : (
                            <div className="text-center py-10 text-xs text-tx-muted italic">No documents.</div>
                        )}
                    </div>
                </div>

                {/* Panel 3: Fields Inspector & JSON View */}
                <div className="flex-1 p-6 flex flex-col md:flex-row overflow-hidden gap-6 bg-surface/5">
                    {selectedDocId ? (
                        <>
                            {/* Editor fields grid */}
                            <div className="flex-1 flex flex-col min-w-0">
                                <div className="flex justify-between items-center mb-4 shrink-0">
                                    <div>
                                        <span className="text-[10px] font-bold text-tx-muted uppercase tracking-wider block">Editing Document</span>
                                        <span className="text-sm font-bold text-tx-main">{selectedDocId}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={handleAddField}
                                            className="px-3 py-1.5 border border-bd/40 rounded-xl text-xs font-semibold hover:border-accent hover:text-accent transition-all"
                                        >
                                            + Add Field
                                        </button>
                                        <button
                                            onClick={handleSaveDoc}
                                            disabled={saving}
                                            className="px-4 py-1.5 bg-accent hover:bg-accent-hover text-white rounded-xl text-xs font-bold shadow-md shadow-accent/15 transition-all"
                                        >
                                            {saving ? "Saving..." : "Save Fields"}
                                        </button>
                                    </div>
                                </div>

                                <div className="flex-1 overflow-y-auto divide-y divide-bd/10 border border-bd/40 rounded-2xl bg-surface/50 p-4 space-y-3 custom-scrollbar">
                                    {docFields.map((field, index) => (
                                        <div key={index} className="grid grid-cols-12 gap-3 pt-3 items-center first:pt-0">
                                            {/* Name */}
                                            <div className="col-span-3">
                                                <input
                                                    type="text"
                                                    value={field.key}
                                                    onChange={(e) => handleFieldChange(index, "key", e.target.value)}
                                                    className="w-full bg-background border border-bd/50 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none"
                                                    placeholder="Field Key"
                                                />
                                            </div>

                                            {/* Type */}
                                            <div className="col-span-2">
                                                <select
                                                    value={field.type}
                                                    onChange={(e) => handleFieldChange(index, "type", e.target.value)}
                                                    className="w-full bg-background border border-bd/50 rounded-lg px-1.5 py-1.5 text-xs focus:outline-none"
                                                >
                                                    <option value="string">String</option>
                                                    <option value="number">Number</option>
                                                    <option value="boolean">Boolean</option>
                                                    <option value="array">Array (JSON)</option>
                                                    <option value="object">Map (JSON)</option>
                                                </select>
                                            </div>

                                            {/* Value */}
                                            <div className="col-span-6">
                                                {field.type === "boolean" ? (
                                                    <select
                                                        value={field.val}
                                                        onChange={(e) => handleFieldChange(index, "val", e.target.value)}
                                                        className="w-full bg-background border border-bd/50 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none"
                                                    >
                                                        <option value="true">true</option>
                                                        <option value="false">false</option>
                                                    </select>
                                                ) : (
                                                    <input
                                                        type="text"
                                                        value={field.val}
                                                        onChange={(e) => handleFieldChange(index, "val", e.target.value)}
                                                        className="w-full bg-background border border-bd/50 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none"
                                                        placeholder={field.type === "array" ? "['tag1', 'tag2']" : "Value"}
                                                    />
                                                )}
                                            </div>

                                            {/* Delete */}
                                            <div className="col-span-1 text-right">
                                                <button
                                                    onClick={() => handleRemoveField(index)}
                                                    className="p-1 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                                                    aria-label="Delete field"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Right JSON preview panel */}
                            <div className="w-80 flex flex-col shrink-0 border-l border-bd/30 pl-6 h-full overflow-hidden hidden md:flex">
                                <div className="flex justify-between items-center mb-4 shrink-0">
                                    <h3 className="text-[10px] font-bold text-tx-muted uppercase tracking-wider">Raw JSON View</h3>
                                    <button
                                        onClick={handleDeleteDoc}
                                        className="text-xs text-red-500 font-bold hover:underline"
                                    >
                                        Delete Document
                                    </button>
                                </div>
                                <pre className="flex-1 bg-background border border-bd/40 rounded-2xl p-4 text-[10px] text-tx-muted font-mono overflow-y-auto leading-relaxed select-all custom-scrollbar">
                                    {rawJson}
                                </pre>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-tx-muted italic">
                            <svg className="w-10 h-10 opacity-30 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"></path></svg>
                            Select a document from list to inspect fields.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FirestoreManager;

import React, { useState, useEffect, useRef } from "react";

const navLinks = [
    { name: "Home", href: "#home" },
    { name: "About", href: "#about" },
    { name: "Skills", href: "#skills" },
    { name: "Projects", href: "#projects" },
    { name: "Education", href: "#education" },
    { name: "Contact", href: "#contact" },
];

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [activeSection, setActiveSection] = useState("home");
    const [theme, setTheme] = useState("dark");
    const isClickScroll = useRef(false);

    // Initial theme detection
    useEffect(() => {
        const root = document.documentElement;
        if (root.classList.contains("dark")) {
            setTheme("dark");
        } else {
            setTheme("light");
        }
    }, []);

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

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);

            if (isClickScroll.current) return;

            let current = "";
            navLinks.forEach((link) => {
                const section = document.getElementById(link.href.substring(1));
                if (section) {
                    const sectionTop = section.offsetTop;
                    if (window.scrollY >= sectionTop - window.innerHeight * 0.4) {
                        current = link.href.substring(1);
                    }
                }
            });
            if (current) {
                setActiveSection(current);
                if (window.location.hash !== `#${current}`) {
                    window.history.replaceState(null, null, `#${current}`);
                }
            }
        };

        window.addEventListener("scroll", handleScroll);
        handleScroll();
        return () => window.removeEventListener("scroll", handleScroll);
    }, [theme]);

    // Close mobile menu on ESC key
    useEffect(() => {
        const onKey = (e) => { if (e.key === "Escape") setIsOpen(false); };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, []);

    return (
        <nav
            className={`fixed w-full z-50 transition-all duration-500 ${scrolled ? "py-3" : "py-5"}`}
        >
            <div
                className={`mx-auto max-w-5xl px-6 rounded-2xl border transition-all duration-500 ${
                    scrolled
                        ? "bg-surface/80 backdrop-blur-xl border-bd/40 shadow-lg shadow-black/[0.04]"
                        : "bg-transparent border-transparent"
                }`}
            >
                <div className="flex justify-between items-center h-14">
                    {/* Brand logo */}
                    <a href="#home" className="text-xl font-bold font-outfit text-tx-main tracking-tight">
                        PS<span className="text-accent">.</span>
                    </a>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                onClick={() => {
                                    isClickScroll.current = true;
                                    setActiveSection(link.href.substring(1));
                                    window.history.pushState(null, null, link.href);
                                    setTimeout(() => { isClickScroll.current = false; }, 1000);
                                }}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                    activeSection === link.href.substring(1)
                                        ? "text-accent bg-accent/10"
                                        : "text-tx-muted hover:text-tx-main hover:bg-surface/60"
                                }`}
                            >
                                {link.name}
                            </a>
                        ))}
                        <div className="w-px h-5 bg-bd mx-3" aria-hidden="true" />
                        <a
                            href="#contact"
                            className="px-5 py-2 bg-accent text-white rounded-lg text-sm font-semibold hover:bg-accent-hover transition-colors shadow-sm"
                        >
                            Hire Me
                        </a>
                        
                        {/* Theme Toggle Button */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-lg text-tx-muted hover:text-accent hover:bg-surface/60 transition-colors ml-2"
                            aria-label="Toggle theme"
                        >
                            {theme === "dark" ? (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707.707M12 8a4 4 0 100 8 4 4 0 000-8z"></path></svg>
                            ) : (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
                            )}
                        </button>
                    </div>

                    {/* Mobile Controls */}
                    <div className="flex items-center gap-2 md:hidden">
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-lg text-tx-muted hover:text-accent hover:bg-surface/50 transition-colors"
                            aria-label="Toggle theme"
                        >
                            {theme === "dark" ? (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707.707M12 8a4 4 0 100 8 4 4 0 000-8z"></path></svg>
                            ) : (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
                            )}
                        </button>
                        
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-2 rounded-lg text-tx-main hover:bg-surface/50 transition-colors"
                            aria-label={isOpen ? "Close menu" : "Open menu"}
                            aria-expanded={isOpen}
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {isOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <div
                className={`md:hidden absolute top-full left-0 w-full overflow-hidden transition-all duration-300 ease-in-out ${
                    isOpen ? "max-h-[28rem] opacity-100" : "max-h-0 opacity-0"
                }`}
            >
                <div className="mx-4 mt-2 bg-surface/95 backdrop-blur-xl border border-bd/40 rounded-2xl shadow-xl p-4 space-y-1">
                    {navLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            onClick={() => {
                                setIsOpen(false);
                                isClickScroll.current = true;
                                setActiveSection(link.href.substring(1));
                                window.history.pushState(null, null, link.href);
                                setTimeout(() => { isClickScroll.current = false; }, 1000);
                            }}
                            className={`block w-full text-center py-3 rounded-xl font-medium transition-colors ${
                                activeSection === link.href.substring(1)
                                    ? "bg-accent/10 text-accent"
                                    : "text-tx-muted hover:bg-background hover:text-tx-main"
                            }`}
                        >
                            {link.name}
                        </a>
                    ))}
                    <div className="pt-2 border-t border-bd/30 mt-2">
                        <a
                            href="#contact"
                            onClick={() => setIsOpen(false)}
                            className="block w-full text-center py-3 bg-accent text-white rounded-xl font-semibold hover:bg-accent-hover transition-colors"
                        >
                            Hire Me
                        </a>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

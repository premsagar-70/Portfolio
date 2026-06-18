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
    const isClickScroll = useRef(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);

            if (isClickScroll.current) return;

            let current = "";
            navLinks.forEach((link) => {
                const section = document.getElementById(link.href.substring(1));
                if (section) {
                    const sectionTop = section.offsetTop;
                    // Provide a proportional offset so it highlights when the section reaches the upper half
                    if (window.scrollY >= sectionTop - window.innerHeight * 0.4) {
                        current = link.href.substring(1);
                    }
                }
            });
            if (current) {
                setActiveSection(current);
                if (window.location.hash !== `#${current}`) {
                    // Update URL hash without jumping
                    window.history.replaceState(null, null, `#${current}`);
                }
            }
        };

        window.addEventListener("scroll", handleScroll);
        // Set initial active section correctly
        handleScroll();
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav
            className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? "bg-background/90 backdrop-blur-md shadow-lg py-4" : "bg-transparent py-6"
                }`}
        >
            <div className="container mx-auto px-6 max-w-6xl flex justify-end md:justify-center items-center">
                {/* <a href="#" className="text-2xl font-bold font-outfit text-tx-main">
                    Prem Sagar<span className="text-accent"></span>
                </a> */}

                {/* Desktop Menu */}
                <div className="hidden md:flex space-x-8 items-center">
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
                            className={`font-medium transition-colors ${activeSection === link.href.substring(1)
                                ? "text-accent"
                                : "text-tx-muted hover:text-accent"
                                }`}
                        >
                            {link.name}
                        </a>
                    ))}
                    <a
                        href="#contact"
                        className="px-5 py-2 border border-accent text-accent rounded-full hover:bg-accent hover:text-white transition-all font-medium"
                    >
                        Hire Me
                    </a>
                </div>

                {/* Mobile Hamburger */}
                <div className="md:hidden">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="text-tx-main focus:outline-none"
                    >
                        <svg
                            className="w-8 h-8"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            {isOpen ? (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            ) : (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h16m-7 6h7"
                                />
                            )}
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-background border-t border-bd shadow-xl">
                    <div className="flex flex-col items-center py-8 space-y-6">
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
                                className={`text-xl font-medium transition-colors ${activeSection === link.href.substring(1)
                                    ? "text-accent"
                                    : "text-tx-muted hover:text-accent"
                                    }`}
                            >
                                {link.name}
                            </a>
                        ))}
                        <a
                            href="#contact"
                            onClick={() => setIsOpen(false)}
                            className="px-8 py-3 bg-accent text-white rounded-full hover:bg-accent-hover transition-all font-medium"
                        >
                            Hire Me
                        </a>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;

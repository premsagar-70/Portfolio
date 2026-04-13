import React, { useState, useEffect } from "react";
import SectionWrapper from "../components/SectionWrapper";
import useAnalytics from "../hooks/useAnalytics";

/**
 * ProjectImageSlider - A premium image slideshow component
 * Handles both single and multiple images (comma-separated).
 */
const ProjectImageSlider = ({ images, title }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    // Split the comma-separated string into an array and trim whitespace
    const imageList = (images || "").split(",").map(img => img.trim()).filter(Boolean);

    useEffect(() => {
        // Only start auto-play if there's more than one image and user is not hovering
        if (imageList.length <= 1 || isHovered) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % imageList.length);
        }, 8000); // 8 seconds for a better reading time

        return () => clearInterval(interval);
    }, [imageList.length, isHovered]);

    const nextSlide = (e) => {
        e.stopPropagation();
        setCurrentIndex((prev) => (prev + 1) % imageList.length);
    };

    const prevSlide = (e) => {
        e.stopPropagation();
        setCurrentIndex((prev) => (prev - 1 + imageList.length) % imageList.length);
    };

    if (imageList.length === 0) return <div className="h-64 w-full bg-surface flex items-center justify-center text-tx-muted">No Image</div>;

    return (
        <div
            className="relative h-64 w-full overflow-hidden bg-background"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Image Slides */}
            {imageList.map((img, index) => (
                <img
                    key={index}
                    src={img}
                    alt={`${title} - Image ${index + 1}`}
                    className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-in-out ${index === currentIndex ? "opacity-100 scale-100 rotate-0" : "opacity-0 scale-110 rotate-1"
                        }`}
                />
            ))}

            {/* Gradient Overlay for better contrast on controls */}
            {imageList.length > 1 && (
                <div className={`absolute inset-0 bg-black/10 transition-opacity duration-300 ${isHovered ? "opacity-100" : "opacity-0"}`} />
            )}

            {/* Manual Navigation Controls */}
            {imageList.length > 1 && (
                <>
                    {/* Previous Button */}
                    <button
                        onClick={prevSlide}
                        className={`absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/40 text-white backdrop-blur-md transition-all duration-500 hover:bg-black/60 z-20 ${isHovered ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-6"
                            }`}
                        aria-label="Previous image"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                    </button>

                    {/* Next Button */}
                    <button
                        onClick={nextSlide}
                        className={`absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/40 text-white backdrop-blur-md transition-all duration-500 hover:bg-black/60 z-20 ${isHovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-6"
                            }`}
                        aria-label="Next image"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                    </button>

                    {/* Pagination Indicators (Dots) */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 px-3 py-1.5 rounded-full bg-black/30 backdrop-blur-md z-20 transition-all duration-300">
                        {imageList.map((_, index) => (
                            <button
                                key={index}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setCurrentIndex(index);
                                }}
                                className={`h-1.5 rounded-full transition-all duration-500 ${index === currentIndex ? "bg-accent w-6" : "bg-white/40 hover:bg-white/60 w-1.5"
                                    }`}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

const Projects = () => {
    const { trackProjectView } = useAnalytics();

    // In a real app, this data might come from a DB or CMS
    const projects = [
        {
            title: "Plant Health Monitoring System",
            description: "A comprehensive solution for monitoring plant health using Drone , IoT and machine learning.",
            tags: ["Flask", "Python", "TensorFlow"],
            image: "/images/projects/plant/Plant_health_prediction_1.png",
            link: "#",
            github: "https://github.com/Premsagar-70/Plant-Health-Monitoring-System",
        },
        {
            title: "Attendance Management System using face recognition",
            description: "An automated system that identifies students using facial recognition and logs their attendance instantly into a database. It replaces manual roll calls with AI to ensure accurate, fast, and fraud-proof record-keeping for classrooms.",
            tags: ["Django", "Python", "FaceNet", "MongoDB"],
            image: "/images/projects/attendance/Attendance_Management_System_1.png,/images/projects/attendance/Attendance_Management_System_2.png,/images/projects/attendance/Attendance_Management_System_3.png,/images/projects/attendance/Attendance_Management_System_5.png,/images/projects/attendance/Attendance_Management_System_6.png",
            link: "#",
            github: "https://github.com/Premsagar-70/Attendance-Management-System-using-face-recognition",
        },
    ];

    return (
        <SectionWrapper id="projects" className="bg-surface/5">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold font-outfit mb-4">My Projects</h2>
                <div className="w-20 h-1 bg-accent mx-auto rounded-full"></div>
            </div>

            <div className="grid md:grid-cols-2 gap-10">
                {projects.map((project, index) => (
                    <div
                        key={index}
                        onClick={() => trackProjectView(project.title)}
                        className="group relative overflow-hidden rounded-2xl bg-surface shadow-2xl border border-bd/30 hover:border-accent/40 transition-all duration-500 hover:-translate-y-2 flex flex-col h-full"
                    >
                        {/* Image Slider Section */}
                        <ProjectImageSlider images={project.image} title={project.title} />

                        {/* Content Section */}
                        <div className="p-8 flex-grow flex flex-col">
                            <h3 className="text-2xl font-bold mb-3 group-hover:text-accent transition-colors flex items-center gap-2">
                                {project.title}
                                {/* <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-0 group-hover:opacity-100 transition-opacity -rotate-45 group-hover:rotate-0"><path d="M5 12h14m-7-7 7 7-7 7" /></svg> */}
                            </h3>
                            <p className="text-tx-muted text-base mb-6 leading-relaxed line-clamp-3">
                                {project.description}
                            </p>

                            {/* Skill Tags */}
                            <div className="flex flex-wrap gap-2 mb-8">
                                {project.tags.map((tag, i) => (
                                    <span
                                        key={i}
                                        className="text-xs font-semibold tracking-wider uppercase px-3 py-1.5 bg-accent/10 text-accent rounded-lg border border-accent/20"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            {/* Action Links */}
                            <div className="mt-auto flex items-center gap-6">
                                <a
                                    href={project.github}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="flex items-center gap-2 text-sm font-bold text-tx-muted hover:text-accent transition-colors group/link"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" /><path d="M9 18c-4.51 2-5-2-7-2" /></svg>
                                    Source Code
                                </a>
                                {project.link !== "#" && (
                                    <a
                                        href={project.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={(e) => e.stopPropagation()}
                                        className="flex items-center gap-2 text-sm font-bold text-tx-muted hover:text-accent transition-colors group/link"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
                                        Live Demo
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </SectionWrapper>
    );
};

export default Projects;



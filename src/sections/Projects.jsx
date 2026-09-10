import React, { useState, useEffect } from "react";
import SectionWrapper from "../components/SectionWrapper";
import useAnalytics from "../hooks/useAnalytics";
import { usePortfolioData } from "../hooks/usePortfolioData";

/**
 * ProjectImageSlider - A premium image slideshow component
 * Handles both thumbnail preview and fullscreen detailed lightbox product gallery.
 */
const ProjectImageSlider = ({ images, title }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const [lightboxOpen, setLightboxOpen] = useState(false);

    const imageList = (images || "").split(",").map(img => img.trim()).filter(Boolean);

    // Auto-scroll loop for thumbnail preview
    useEffect(() => {
        if (imageList.length <= 1 || isHovered || lightboxOpen) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % imageList.length);
        }, 8000);

        return () => clearInterval(interval);
    }, [imageList.length, isHovered, lightboxOpen]);

    // Prevent page scrolling when fullscreen image viewer is active
    useEffect(() => {
        if (lightboxOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [lightboxOpen]);

    const nextSlide = (e) => {
        if (e) e.stopPropagation();
        setCurrentIndex((prev) => (prev + 1) % imageList.length);
    };

    const prevSlide = (e) => {
        if (e) e.stopPropagation();
        setCurrentIndex((prev) => (prev - 1 + imageList.length) % imageList.length);
    };

    if (imageList.length === 0) {
        return (
            <div className="h-56 sm:h-64 w-full bg-surface flex items-center justify-center text-tx-muted text-sm">
                No Image
            </div>
        );
    }

    return (
        <>
            {/* Thumbnail Preview Area */}
            <div
                className="relative h-56 sm:h-64 w-full overflow-hidden bg-background rounded-xl cursor-pointer"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={() => setLightboxOpen(true)}
            >
                {imageList.map((img, index) => (
                    <img
                        key={index}
                        src={img}
                        alt={`${title} - Image ${index + 1}`}
                        className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-in-out ${
                            index === currentIndex ? "opacity-100 scale-100" : "opacity-0 scale-105"
                        }`}
                    />
                ))}

                {/* Left/Right thumbnail controllers */}
                {imageList.length > 1 && (
                    <>
                        <button
                            onClick={prevSlide}
                            className={`absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 text-white backdrop-blur-sm transition-all duration-300 hover:bg-black/60 z-20 ${
                                isHovered ? "opacity-100" : "opacity-0"
                            }`}
                            aria-label="Previous image"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                        </button>

                        <button
                            onClick={nextSlide}
                            className={`absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 text-white backdrop-blur-sm transition-all duration-300 hover:bg-black/60 z-20 ${
                                isHovered ? "opacity-100" : "opacity-0"
                            }`}
                            aria-label="Next image"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                        </button>

                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
                            {imageList.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={(e) => { e.stopPropagation(); setCurrentIndex(index); }}
                                    className={`h-1.5 rounded-full transition-all duration-400 ${
                                        index === currentIndex ? "bg-white w-5" : "bg-white/40 w-1.5 hover:bg-white/70"
                                    }`}
                                    aria-label={`Go to slide ${index + 1}`}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* Premium Fullscreen Lightbox Modal (Product Gallery Style) */}
            {lightboxOpen && (
                <div
                    className="fixed inset-0 bg-black/95 backdrop-blur-md z-[100] flex flex-col items-center justify-between p-6 sm:p-8 animate-fade-in"
                    onClick={() => setLightboxOpen(false)}
                >
                    {/* Header Area */}
                    <div className="w-full flex items-center justify-between z-[110] shrink-0 text-white">
                        <div className="text-left font-outfit">
                            <h4 className="font-bold text-lg">{title}</h4>
                            <p className="text-xs text-white/50">Viewing Image {currentIndex + 1} of {imageList.length}</p>
                        </div>
                        <button
                            onClick={() => setLightboxOpen(false)}
                            className="p-3 bg-white/5 hover:bg-white/15 text-white/80 hover:text-white rounded-full transition-all border border-white/10"
                            aria-label="Close fullscreen view"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Image Viewer Wrapper */}
                    <div
                        className="relative max-w-4xl w-full flex-grow flex items-center justify-center min-h-0 my-4"
                        onClick={(e) => e.stopPropagation()} // Prevent modal close on image click
                    >
                        {/* Lightbox Left Navigation */}
                        {imageList.length > 1 && (
                            <button
                                onClick={prevSlide}
                                className="absolute left-2 sm:-left-16 p-3.5 bg-white/5 hover:bg-white/15 text-white rounded-full transition-all border border-white/10 z-[110]"
                                aria-label="Previous image"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                            </button>
                        )}

                        {/* Large Rendered Image */}
                        <img
                            src={imageList[currentIndex]}
                            alt={`${title} - Expanded View`}
                            className="max-w-full max-h-[60vh] object-contain rounded-xl shadow-2xl select-none"
                        />

                        {/* Lightbox Right Navigation */}
                        {imageList.length > 1 && (
                            <button
                                onClick={nextSlide}
                                className="absolute right-2 sm:-right-16 p-3.5 bg-white/5 hover:bg-white/15 text-white rounded-full transition-all border border-white/10 z-[110]"
                                aria-label="Next image"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                            </button>
                        )}
                    </div>

                    {/* Bottom Row Thumbnails (Product Gallery Style) */}
                    {imageList.length > 1 && (
                        <div
                            className="w-full max-w-2xl mt-4 flex justify-center gap-3 overflow-x-auto py-2 shrink-0 z-[110] scrollbar-thin scrollbar-thumb-white/20"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {imageList.map((img, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentIndex(index)}
                                    className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 transition-all duration-300 shrink-0 ${
                                        index === currentIndex 
                                            ? "border-accent scale-105 shadow-lg shadow-accent/25" 
                                            : "border-white/10 hover:border-white/30"
                                    }`}
                                >
                                    <img
                                        src={img}
                                        alt={`${title} thumbnail ${index + 1}`}
                                        className="w-full h-full object-cover select-none"
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </>
    );
};

const Projects = () => {
    const { trackProjectView } = useAnalytics();
    const { data } = usePortfolioData();
    const projects = data.projects;

    return (
        <SectionWrapper id="projects">
            <div className="text-center mb-16">
                <p className="text-accent font-medium text-sm tracking-widest uppercase mb-3">Portfolio</p>
                <h2 className="text-3xl md:text-4xl font-bold font-outfit">My Projects</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                {projects.map((project, index) => (
                    <div
                        key={index}
                        onClick={() => trackProjectView(project.title)}
                        className="group bg-surface border border-bd/40 rounded-2xl overflow-hidden hover:border-accent/30 transition-all duration-300 hover:shadow-xl hover:shadow-accent/5 flex flex-col h-full"
                    >
                        {/* Image */}
                        <div className="p-3 pb-0">
                            <ProjectImageSlider images={project.image} title={project.title} />
                        </div>

                        {/* Content */}
                        <div className="p-6 pt-5 flex-grow flex flex-col">
                            {/* Title (Redirects to Deployed Site if Provided) */}
                            {project.link && project.link !== "#" ? (
                                <a
                                    href={project.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xl font-bold font-outfit mb-2 hover:text-accent transition-colors cursor-pointer block text-tx-main"
                                >
                                    {project.title}
                                </a>
                            ) : (
                                <h3 className="text-xl font-bold font-outfit mb-2 text-tx-main">
                                    {project.title}
                                </h3>
                            )}

                            <p className="text-tx-muted text-sm leading-relaxed mb-5 flex-grow">
                                {project.description}
                            </p>

                            {/* Tags */}
                            <div className="flex flex-wrap gap-2 mb-5">
                                {project.tags.map((tag, i) => (
                                    <span
                                        key={i}
                                        className="text-xs font-medium px-2.5 py-1 bg-background text-tx-muted rounded-md border border-bd/50"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-4 pt-4 border-t border-bd/30">
                                {project.github && (
                                    <a
                                        href={project.github}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 text-sm font-semibold text-tx-muted hover:text-accent transition-colors"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" /><path d="M9 18c-4.51 2-5-2-7-2" /></svg>
                                        Source Code
                                    </a>
                                )}
                                {project.link && project.link !== "#" && (
                                    <a
                                        href={project.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 text-sm font-semibold text-tx-muted hover:text-accent transition-colors"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
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

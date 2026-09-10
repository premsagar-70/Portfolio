import React from "react";
import SectionWrapper from "../components/SectionWrapper";
import { usePortfolioData } from "../hooks/usePortfolioData";

const Resume = () => {
    const { data } = usePortfolioData();
    const profile = data.profile;
    const education = data.education;

    return (
        <SectionWrapper id="resume">
            <div className="max-w-3xl mx-auto text-center">
                <p className="text-accent font-semibold text-sm tracking-widest uppercase mb-3">Career</p>
                <h2 className="text-3xl md:text-4xl font-bold font-outfit mb-4">Resume</h2>
                <p className="text-tx-muted max-w-xl mx-auto mb-10">
                    Check out my resume to see my education, experience, and what I can bring to your team.
                </p>
                <a
                    href={profile.resumeUrl}
                    download
                    className="inline-flex items-center gap-2.5 px-8 py-4 bg-accent text-white rounded-xl font-semibold hover:bg-accent-hover transition-all shadow-lg shadow-accent/20 hover:-translate-y-0.5 active:translate-y-0"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                    Download Resume
                </a>
            </div>

            <div className="max-w-3xl mx-auto mt-16 animate-fade-in">
                {/* 
                    ── NOTE: Experience section is available below. Uncomment when you have work experience to show. ──
                    <div className="space-y-8 mb-16">
                        <h3 className="text-2xl font-bold font-outfit text-tx-main mb-8">Experience</h3>
                        <div className="relative pl-16">
                            <div className="absolute left-4 top-1.5 w-4 h-4 rounded-full bg-accent border-4 border-background z-10" />
                            <div className="bg-surface border border-bd/40 rounded-2xl p-6">
                                <h4 className="text-lg font-bold">Job Title</h4>
                                <span className="text-sm font-semibold text-accent">Year - Year</span>
                                <p className="text-tx-muted mt-2">Company Name - Location</p>
                                <p className="text-tx-muted text-sm mt-2">Description of responsibilities...</p>
                            </div>
                        </div>
                    </div>
                */}

                <h3 className="text-2xl font-bold font-outfit text-tx-main mb-8">Education</h3>
                <div className="relative">
                    <div className="absolute left-6 top-2 bottom-2 w-px bg-bd" aria-hidden="true" />

                    <div className="space-y-8">
                        {education.map((edu, index) => (
                            <div key={index} className="relative pl-16">
                                <div className="absolute left-4 top-1.5 w-4 h-4 rounded-full bg-accent border-4 border-background z-10" />
                                <div className="bg-surface border border-bd/40 rounded-2xl p-6 hover:border-accent/30 transition-colors">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                                        <h4 className="text-lg font-bold font-outfit">
                                            {edu.degree}
                                        </h4>
                                        <span className="text-sm font-semibold text-accent bg-accent/10 px-3 py-1 rounded-lg whitespace-nowrap">
                                            {edu.date}
                                        </span>
                                    </div>
                                    <p className="text-tx-muted">{edu.school}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </SectionWrapper>
    );
};

export default Resume;

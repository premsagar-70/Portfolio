import React from "react";
import SectionWrapper from "../components/SectionWrapper";
import { usePortfolioData } from "../hooks/usePortfolioData";

const Education = () => {
    const { data } = usePortfolioData();
    const education = data.education;

    return (
        <SectionWrapper id="education">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-16">
                    <p className="text-accent font-semibold text-sm tracking-widest uppercase mb-3">Background</p>
                    <h2 className="text-3xl md:text-4xl font-bold font-outfit">Education</h2>
                </div>

                <div className="relative">
                    {/* Timeline line */}
                    <div className="absolute left-6 top-2 bottom-2 w-px bg-bd" aria-hidden="true" />

                    <div className="space-y-12">
                        {education.map((edu, index) => (
                            <div key={index} className="relative pl-16 animate-fade-in">
                                {/* Timeline dot */}
                                <div className="absolute left-4 top-6 w-4 h-4 rounded-full bg-accent border-4 border-background z-10" />

                                <div className="bg-surface/50 backdrop-blur-md border border-bd/40 rounded-2xl p-6 md:p-8 hover:border-accent/30 transition-all duration-300 hover:shadow-lg hover:shadow-accent/5">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
                                        <h3 className="text-lg md:text-xl font-bold font-outfit text-tx-main">
                                            {edu.degree}
                                        </h3>
                                        <span className="text-sm font-semibold text-accent bg-accent/10 px-3 py-1 rounded-lg whitespace-nowrap">
                                            {edu.date}
                                        </span>
                                    </div>
                                    <p className="text-tx-muted font-medium mb-4">
                                        {edu.school}
                                    </p>
                                    {edu.bullets && edu.bullets.length > 0 && (
                                        <ul className="text-tx-muted text-sm space-y-2">
                                            {edu.bullets.map((bullet, idx) => (
                                                <li key={idx} className="flex items-start gap-2">
                                                    <span className="text-accent mt-1 shrink-0">•</span>
                                                    <span>{bullet}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </SectionWrapper>
    );
};

export default Education;

import React from "react";
import SectionWrapper from "../components/SectionWrapper";
import { usePortfolioData } from "../hooks/usePortfolioData";

const About = () => {
    const { data } = usePortfolioData();
    const profile = data.profile;

    return (
        <SectionWrapper id="about">
            <div className="max-w-3xl mx-auto text-center">
                <p className="text-accent font-medium text-sm tracking-widest uppercase mb-3">About Me</p>
                <h2 className="text-3xl md:text-4xl font-bold font-outfit mb-8">
                    {profile.aboutHeading}
                </h2>

                <p className="text-tx-muted text-lg leading-relaxed mb-6">
                    {profile.aboutText1}
                </p>
                <p className="text-tx-muted text-lg leading-relaxed">
                    {profile.aboutText2}
                </p>
            </div>

            {/* 
                ── NOTE: Stats section is available below. Uncomment and fill in your real values. ──
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 mt-16 max-w-2xl mx-auto">
                    <div className="text-center p-6 bg-surface border border-bd/40 rounded-2xl">
                        <h4 className="text-3xl font-bold font-outfit text-accent mb-1">X</h4>
                        <p className="text-sm text-tx-muted">Years Experience</p>
                    </div>
                    <div className="text-center p-6 bg-surface border border-bd/40 rounded-2xl">
                        <h4 className="text-3xl font-bold font-outfit text-accent mb-1">X</h4>
                        <p className="text-sm text-tx-muted">Projects Completed</p>
                    </div>
                    <div className="text-center p-6 bg-surface border border-bd/40 rounded-2xl">
                        <h4 className="text-3xl font-bold font-outfit text-accent mb-1">X</h4>
                        <p className="text-sm text-tx-muted">Technologies</p>
                    </div>
                </div>
            */}
        </SectionWrapper>
    );
};

export default About;

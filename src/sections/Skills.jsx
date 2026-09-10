import React from "react";
import SectionWrapper from "../components/SectionWrapper";
import { usePortfolioData } from "../hooks/usePortfolioData";

const Skills = () => {
    const { data } = usePortfolioData();
    const skills = data.skills;

    return (
        <SectionWrapper id="skills">
            <div className="text-center mb-16">
                <p className="text-accent font-medium text-sm tracking-widest uppercase mb-3">Technical Stack</p>
                <h2 className="text-3xl md:text-4xl font-bold font-outfit">Skills & Technologies</h2>
                <p className="text-tx-muted max-w-lg mx-auto mt-4">The tools and technologies I work with to bring ideas to life.</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {skills.map((skillGroup, index) => (
                    <div
                        key={index}
                        className="group p-6 bg-surface border border-bd/40 rounded-2xl hover:border-accent/30 transition-all duration-300 hover:shadow-lg hover:shadow-accent/5"
                    >
                        <h3 className="text-lg font-bold font-outfit mb-5 text-tx-main group-hover:text-accent transition-colors">
                            {skillGroup.category}
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {skillGroup.items.map((skill, idx) => (
                                <span
                                    key={idx}
                                    className="px-3 py-1.5 bg-background text-sm text-tx-muted rounded-lg border border-bd/50 hover:border-accent/40 hover:text-accent transition-all cursor-default"
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </SectionWrapper>
    );
};

export default Skills;

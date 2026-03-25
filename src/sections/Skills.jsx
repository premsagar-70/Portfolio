import React from "react";
import SectionWrapper from "../components/SectionWrapper";

const Skills = () => {
    const skills = [
        // { category: "Languages", items: ["Python", "Java", "C"] },
        { category: "Languages", items: ["Python"] },
        { category: "Frontend", items: ["HTML5", "CSS3", "JavaScript", "React.js", "Tailwind CSS"] },
        { category: "Backend", items: ["Node.js", "Express.js", "MongoDB", "SQL"] },
        { category: "Tools", items: ["Git & GitHub", "VS Code"] },
        { category: "Frameworks", items: ["Flask", "Django"] },
    ];

    return (
        <SectionWrapper id="skills">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold font-outfit mb-4">My Skills</h2>
                <div className="w-20 h-1 bg-accent mx-auto rounded-full"></div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {skills.map((skillGroup, index) => (
                    <div
                        key={index}
                        className="bg-surface shadow-xl p-8 rounded-xl border border-bd/50 hover:border-accent/30 transition-all hover:shadow-lg hover:shadow-accent/5 group"
                    >
                        <h3 className="text-xl font-bold mb-6 text-accent group-hover:text-tx-main transition-colors">
                            {skillGroup.category}
                        </h3>
                        <div className="flex flex-wrap gap-3">
                            {skillGroup.items.map((skill, idx) => (
                                <span
                                    key={idx}
                                    className="px-4 py-2 bg-background rounded-full text-sm text-tx-muted border border-bd hover:border-accent hover:text-accent transition-all cursor-default"
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

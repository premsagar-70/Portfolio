import React from "react";
import SectionWrapper from "../components/SectionWrapper";

const About = () => {
    return (
        <SectionWrapper id="about" className="bg-surface/10">
            <div className="text-center mb-6">
                <h2 className="text-3xl md:text-4xl font-bold font-outfit mb-4">About Me</h2>
                <div className="w-20 h-1 bg-accent mx-auto rounded-full"></div>
            </div>

            <div className="grid md:grid-cols-0 gap-12 items-center">
                <div>
                    <h3 className="text-2xl font-semibold mb-6">
                        Passionate about creating modern web applications.
                    </h3>
                    <p className="text-tx-muted mb-6 leading-relaxed">
                        I am a dedicated developer with a strong foundation in frontend and backend technologies.
                        My journey involves solving complex problems and turning innovative ideas into reality through code.
                    </p>
                    <p className="text-tx-muted mb-8 leading-relaxed">
                        I constantly learn new technologies to stay up-to-date with industry trends.
                        Whether it's building a robust backend or crafting a beautiful user interface, I enjoy every aspect of development.
                    </p>
                    {/* 
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-surface/20 rounded-lg border border-secondary/30">
                            <h4 className="font-bold text-accent text-xl mb-1">00</h4>
                            <p className="text-sm text-tx-muted">Years Experience</p>
                        </div>
                        <div className="p-4 bg-surface/20 rounded-lg border border-secondary/30">
                            <h4 className="font-bold text-accent text-xl mb-1">2</h4>
                            <p className="text-sm text-tx-muted">Projects Completed</p>
                        </div>
                    </div> */}
                </div>
                {/* Decorative elements */}
                {/* <div className="relative">
                    <div className="absolute -top-4 -left-4 w-24 h-24 border-t-4 border-l-4 border-accent rounded-tl-3xl opacity-50"></div>
                    <div className="absolute -bottom-4 -right-4 w-24 h-24 border-b-4 border-r-4 border-accent rounded-br-3xl opacity-50"></div>
                    <div className="aspect-video bg-gradient-to-br from-secondary to-primary rounded-xl flex items-center justify-center border border-bd">
                        <span className="text-tx-muted">About Image / Illustration</span>
                    </div>
                </div> */}
            </div>
        </SectionWrapper>
    );
};

export default About;

import React from "react";
import SectionWrapper from "../components/SectionWrapper";
import { usePortfolioData } from "../hooks/usePortfolioData";

const Hero = () => {
    const { data } = usePortfolioData();
    const profile = data.profile;

    return (
        <SectionWrapper id="home" className="min-h-screen flex items-center pt-20">
            <div className="flex flex-col md:flex-row items-center justify-between w-full gap-16">
                {/* Text Content */}
                <div className="flex-1 text-center md:text-left animate-slide-up">
                    <p className="text-accent font-medium text-sm md:text-base mb-5 tracking-widest uppercase">
                        {profile.title}
                    </p>

                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold font-outfit leading-[1.1] tracking-tight mb-6">
                        Hi, I'm{" "}
                        <span className="text-gradient">{profile.name}</span>
                    </h1>

                    <p className="text-tx-muted text-lg md:text-xl max-w-xl mx-auto md:mx-0 mb-10 leading-relaxed">
                        {profile.bio}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                        <a
                            href="#projects"
                            className="px-8 py-4 bg-accent text-white rounded-xl font-semibold hover:bg-accent-hover transition-all shadow-lg shadow-accent/20 hover:shadow-accent/30 hover:-translate-y-0.5 active:translate-y-0"
                        >
                            View Projects
                        </a>
                        <a
                            href="#contact"
                            className="px-8 py-4 bg-surface border border-bd text-tx-main rounded-xl font-semibold hover:border-accent hover:text-accent transition-all hover:-translate-y-0.5 active:translate-y-0"
                        >
                            Contact Me
                        </a>
                    </div>
                </div>

                {/* Profile Image */}
                <div className="flex-1 w-full max-w-sm relative hidden md:flex justify-center items-center animate-fade-in">
                    <div className="relative">
                        {/* Decorative ring */}
                        <div className="absolute -inset-4 rounded-full border border-bd/70" />
                        <div className="absolute -inset-8 rounded-full border border-bd/50" />

                        <div className="w-200 h-200 lg:w-150 lg:h-150 rounded-full overflow-hidden border-2 border-bd/60 shadow-2xl shadow-accent/10 relative z-10">
                            <img
                                src="/images/image.png"
                                alt={profile.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&background=4f46e5&color=fff&size=400`;
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </SectionWrapper>
    );
};

export default Hero;

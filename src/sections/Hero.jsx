import React from "react";
import SectionWrapper from "../components/SectionWrapper";

const Hero = () => {
    return (
        <SectionWrapper id="home" className="min-h-screen flex items-center pt-24">
            <div className="flex flex-col md:flex-row items-center justify-between w-full gap-12">
                <div className="flex-1 text-center md:text-left">
                    <h2 className="text-accent font-medium text-lg md:text-xl mb-4 tracking-wide">
                        HELLO, I'M
                    </h2>
                    <h1 className="text-5xl md:text-4xl font-bold font-outfit mb-6 leading-tight">
                        Mahasamudhram Prem Sagar
                    </h1>
                    {/* <h3 className="text-2xl md:text-4xl text-tx-muted font-semibold mb-8">
                        Full Stack Developer
                    </h3> */}
                    <h3 className="text-2xl md:text-4xl text-tx-muted font-semibold mb-8">
                        Software Engineer
                    </h3>
                    <p className="text-tx-muted max-w-lg mx-auto md:mx-0 mb-10 text-lg leading-relaxed">
                        I build accessible, pixel-perfect, secure, and accessible digital experiences that solve real-world problems.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                        <a
                            href="#projects"
                            className="px-8 py-4 bg-accent text-white rounded-full font-bold hover:bg-accent-hover transition-all shadow-lg hover:shadow-accent/25"
                        >
                            View Projects
                        </a>
                        <a
                            href="#contact"
                            className="px-8 py-4 border border-bd text-tx-main rounded-full font-bold hover:border-accent hover:text-accent transition-all"
                        >
                            Contact Me
                        </a>
                    </div>
                </div>
                <div className="flex-1 w-full max-w-md relative md:block hidden">
                    <div className="relative w-72 h-72 md:w-96 md:h-96 mx-auto">
                        <div className="absolute inset-0 bg-gradient-to-tr from-accent to-purple-500 rounded-full blur-2xl opacity-20 animate-pulse"></div>
                        <img
                            src="/images/image.png" // Replace with actual profile text/image later or leave placeholder
                            alt="Profile"
                            className="rounded-full object-cover w-full h-full border-4 border-secondary/50 relative z-10 shadow-2xl"
                        />
                    </div>
                </div>
            </div>
        </SectionWrapper>
    );
};

export default Hero;

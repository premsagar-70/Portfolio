import React from "react";

const SectionWrapper = ({ id, className, children }) => {
    return (
        <section id={id} className={`py-20 md:py-24 section-padding ${className || ""}`}>
            <div className="container mx-auto px-4 md:px-8 max-w-6xl">
                {children}
            </div>
        </section>
    );
};

export default SectionWrapper;

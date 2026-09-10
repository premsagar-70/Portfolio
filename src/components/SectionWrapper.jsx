import React from "react";

const SectionWrapper = ({ id, className, children }) => {
    return (
        <section
            id={id}
            className={`py-24 md:py-32 ${className || ""}`}
        >
            <div className="container mx-auto px-6 md:px-8 max-w-6xl">
                {children}
            </div>
        </section>
    );
};

export default SectionWrapper;

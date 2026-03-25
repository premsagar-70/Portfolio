import React from "react";
import SectionWrapper from "../components/SectionWrapper";

const Resume = () => {
    return (
        <SectionWrapper id="resume" className="bg-surface/5">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold font-outfit mb-4">Resume</h2>
                <div className="w-20 h-1 bg-accent mx-auto rounded-full mb-8"></div>
                <p className="text-tx-muted max-w-xl mx-auto mb-8">
                    Check out my resume to see my education, experience, and what I can bring to your team.
                </p>
                <a
                    href="/resume.pdf" // Placeholder path, user can replace
                    download
                    className="inline-flex items-center gap-2 px-8 py-4 bg-background border border-accent text-accent rounded-full font-bold hover:bg-accent hover:text-white transition-all shadow-lg"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                    Download Resume
                </a>
            </div>

            {/* Optional: Preview or Timeline representation */}
            <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
                {/* <div className="space-y-8">
                    <h3 className="text-2xl font-bold font-outfit text-tx-main">Experience</h3>
                    <div className="relative border-l border-bd pl-8 ml-4 space-y-8">
                        <div className="relative">
                            <span className="absolute -left-[41px] top-1 w-5 h-5 bg-accent rounded-full border-4 border-primary"></span>
                            <h4 className="text-xl font-bold">Senior Web Developer</h4>
                            <span className="text-sm text-accent">2023 - Present</span>
                            <p className="text-tx-muted mt-2">Company Name - Location</p>
                            <p className="text-tx-muted text-sm mt-2">Led development of multiple high-impact web applications...</p>
                        </div>
                        <div className="relative">
                            <span className="absolute -left-[41px] top-1 w-5 h-5 bg-gray-700 rounded-full border-4 border-primary"></span>
                            <h4 className="text-xl font-bold">Web Developer</h4>
                            <span className="text-sm text-accent">2021 - 2023</span>
                            <p className="text-tx-muted mt-2">Company Name - Location</p>
                            <p className="text-tx-muted text-sm mt-2">Collaborated with cross-functional teams to deliver...</p>
                        </div>
                    </div>
                </div> */}

                <div className="space-y-8">
                    <h3 className="text-2xl font-bold font-outfit text-tx-main">Education</h3>
                    <div className="relative border-l border-bd pl-8 ml-4 space-y-8">
                        {/* <div className="relative">
                            <span className="absolute -left-[41px] top-1 w-5 h-5 bg-accent rounded-full border-4 border-primary"></span>
                            <h4 className="text-xl font-bold">Master of Computer Application</h4>
                            <span className="text-sm text-accent">2019 - 2021</span>
                            <p className="text-tx-muted mt-2">University Name</p>
                        </div> */}
                        <div className="relative">
                            <span className="absolute -left-[41px] top-1 w-5 h-5 bg-gray-700 rounded-full border-4 border-primary"></span>
                            <h4 className="text-xl font-bold">Bachelor of Technology in Artificial Intelligence and Data Science</h4>
                            <span className="text-sm text-accent">2023 - 2027</span>
                            <p className="text-tx-muted mt-2">Sree rama engineering college, (Affiliated to JNTUA), Tirupati</p>
                        </div>
                    </div>
                </div>
            </div>
        </SectionWrapper>
    );
};

export default Resume;

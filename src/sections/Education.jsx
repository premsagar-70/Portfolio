import React from "react";
import SectionWrapper from "../components/SectionWrapper";

const Education = () => {
    return (
        <SectionWrapper id="education" className="bg-surface/5">

            <div className="max-w-4xl mx-auto ">

                <div className="space-y-8 ">
                    <h2 className="text-3xl md:text-4xl font-bold font-outfit mb-4 text-center">Education</h2>
                    <div className="w-20 h-1 bg-accent mx-auto rounded-full mb-8"></div>

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
                            <p className="text-tx-muted mt-2">Sree rama engineering college (Affiliated to JNTUA), Tirupati</p>
                            <ul className="text-tx-muted mt-2 list-disc ml-6">
                                <li>Specializing in Artificial Intelligence and Data Science</li>
                                <li>Strong foundation in Machine Learning and Deep Learning</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </SectionWrapper>
    );
};

export default Education;

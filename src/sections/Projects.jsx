import React from "react";
import SectionWrapper from "../components/SectionWrapper";

const Projects = () => {
    const projects = [
        {
            title: "Plant Health Monitoring System",
            description: "A comprehensive solution for monitoring plant health using Drone , IoT and machine learning.",
            tags: ["Flask", "Python", "TensorFlow"],
            image: "/Plant_health_prediction_1.png",
            link: "#",
            github: "https://github.com/Premsagar-70/Plant-Health-Monitoring-System",
        },
        {
            title: "Attendance Management System using face recognition",
            description: "An automated system that identifies students using facial recognition and logs their attendance instantly into a database. It replaces manual roll calls with AI to ensure accurate, fast, and fraud-proof record-keeping for classrooms.",
            tags: ["Django", "Python", "FaceNet", "MongoDB"],
            image: "/Attendance_Management_System_1.png",
            link: "#",
            github: "https://github.com/Premsagar-70/Attendance-Management-System-using-face-recognition",
        },
        // {
        //     title: "Project Three",
        //     description: "Mobile-first e-commerce application.",
        //     tags: ["React Native", "Redux", "Stripe"],
        //     image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
        //     link: "#",
        //     github: "#",
        // },
    ];

    return (
        <SectionWrapper id="projects" className="bg-surface/5">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold font-outfit mb-4">My Projects</h2>
                <div className="w-20 h-1 bg-accent mx-auto rounded-full"></div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
                {projects.map((project, index) => (
                    <div
                        key={index}
                        className="group relative overflow-hidden rounded-xl bg-surface shadow-xl border border-bd/50 hover:border-accent/50 transition-all h-[500px]"
                    >
                        {/* Placeholder for project image */}
                        {/* <div className="h-48 bg-gray-800 w-full object-cover group-hover:scale-105 transition-transform duration-500"></div> */}
                        <img src={project.image} alt={project.title} className="h-54 w-full bg-background object-cover group-hover:scale-105 transition-transform duration-500" />

                        <div className="p-6">
                            <h3 className="text-xl font-bold mb-2 group-hover:text-accent transition-colors">{project.title}</h3>
                            <p className="text-tx-muted text-sm mb-4 line-clamp-3">{project.description}</p>
                            <div className="flex flex-wrap gap-2 mb-6">
                                {project.tags.map((tag, i) => (
                                    <span key={i} className="text-xs px-2 py-1 bg-background/50 text-accent rounded">{tag}</span>
                                ))}
                            </div>
                        </div>

                        {/* Overlay */}
                        {/* <div className="absolute inset-0 bg-background/90 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-4">
                            <a href={project.link} className="px-6 py-2 bg-accent text-white rounded-full font-medium hover:bg-accent-hover transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-75">
                                Live Demo
                            </a>
                            <a href={project.github} className="px-6 py-2 border border-bd text-tx-main rounded-full font-medium hover:bg-tx-main hover:text-background transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-100">
                                GitHub
                            </a>
                        </div> */}
                    </div>
                ))}
            </div>

            {/* <div className="text-center mt-12">
                <a href="#" className="font-medium text-accent hover:text-tx-main transition-colors border-b border-accent hover:border-bd pb-1">View All Projects</a>
            </div> */}
        </SectionWrapper>
    );
};

export default Projects;

import React, { useState, useEffect, createContext, useContext } from "react";
import { db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

const defaultData = {
  profile: {
    name: "Mahasamudhram Prem Sagar",
    title: "Full-Stack Developer & AI Enthusiast",
    bio: "I design and develop full-stack web applications with a focus on performance, clean architecture, and intuitive user experiences.",
    aboutHeading: "Engineering solutions at the intersection of web development and artificial intelligence.",
    aboutText1: "I'm a B.Tech student specializing in AI & Data Science with a deep passion for building production-grade web applications. My work spans both the frontend and backend — from designing responsive interfaces in React to architecting server-side logic with Django, Flask, and Node.js.",
    aboutText2: "I thrive on learning emerging technologies, contributing to meaningful projects, and writing clean, maintainable code. I'm actively seeking opportunities where I can apply my skills to real-world challenges and grow as an engineer.",
    email: "contact@premsagarr.me",
    emailFooter: "premsagar@premsagarr.me",
    phone: "+91 7207105206",
    linkedin: "https://linkedin.com/in/prem-sagar-m",
    github: "https://github.com/premsagar-70",
    leetcode: "https://leetcode.com/",
    resumeUrl: "/resume.pdf"
  },
  skills: [
    { category: "Languages", items: ["Python"] },
    { category: "Frontend", items: ["HTML5", "CSS3", "JavaScript", "React.js", "Tailwind CSS"] },
    { category: "Backend", items: ["Node.js", "Express.js", "MongoDB", "SQL"] },
    { category: "Tools", items: ["Git & GitHub", "VS Code"] },
    { category: "Frameworks", items: ["Flask", "Django"] }
  ],
  projects: [
    {
      title: "Plant Health Monitoring System",
      description: "A comprehensive solution for monitoring plant health using Drone, IoT and machine learning.",
      tags: ["Flask", "Python", "TensorFlow"],
      image: "/images/projects/plant/Plant_health_prediction_1.png",
      link: "#",
      github: "https://github.com/Premsagar-70/Plant-Health-Monitoring-System"
    },
    {
      title: "Attendance Management System using face recognition",
      description: "An automated system that identifies students using facial recognition and logs their attendance instantly into a database. It replaces manual roll calls with AI to ensure accurate, fast, and fraud-proof record-keeping for classrooms.",
      tags: ["Django", "Python", "FaceNet", "MongoDB"],
      image: "/images/projects/attendance/Attendance_Management_System_1.png,/images/projects/attendance/Attendance_Management_System_2.png,/images/projects/attendance/Attendance_Management_System_3.png,/images/projects/attendance/Attendance_Management_System_5.png,/images/projects/attendance/Attendance_Management_System_6.png",
      link: "#",
      github: "https://github.com/Premsagar-70/Attendance-Management-System-using-face-recognition"
    }
  ],
  education: [
    {
      degree: "Bachelor of Technology in Artificial Intelligence and Data Science",
      school: "Sree Rama Engineering College (Affiliated to JNTUA), Tirupati",
      date: "2023 – 2027",
      bullets: [
        "Specializing in Artificial Intelligence and Data Science core concepts.",
        "Building a strong foundation in Machine Learning algorithms, Deep Learning, and advanced analytics."
      ]
    },
    {
      degree: "Intermediate - M.P.C",
      school: "Sri Chaitanya Junior College, Tirupati",
      date: "2021 – 2023",
      bullets: []
    }
  ]
};

const PortfolioContext = createContext(null);

export const PortfolioProvider = ({ children }) => {
  const [data, setData] = useState(defaultData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadContent = async () => {
      try {
        const docRef = doc(db, "content", "data");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          // Merge fetched data with default structures to avoid missing field errors
          const fetched = docSnap.data();
          setData({
            profile: { ...defaultData.profile, ...fetched.profile },
            skills: fetched.skills || defaultData.skills,
            projects: fetched.projects || defaultData.projects,
            education: fetched.education || defaultData.education
          });
        } else {
          // Create document with default data if it doesn't exist
          await setDoc(docRef, defaultData);
        }
      } catch (err) {
        console.warn("Failed to load portfolio content from Firestore. Using defaults.", err);
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, []);

  const updatePortfolioData = async (newData) => {
    try {
      const docRef = doc(db, "content", "data");
      await setDoc(docRef, newData);
      setData(newData);
      return true;
    } catch (err) {
      console.error("Failed to save content to Firestore:", err);
      throw err;
    }
  };

  return React.createElement(
    PortfolioContext.Provider,
    { value: { data, loading, updatePortfolioData, defaultData } },
    children
  );
};

export const usePortfolioData = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    return { data: defaultData, loading: false, updatePortfolioData: async () => {}, defaultData };
  }
  return context;
};


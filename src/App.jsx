import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Hero from "./sections/Hero";
import About from "./sections/About";
import Skills from "./sections/Skills";
import Projects from "./sections/Projects";
import Resume from "./sections/Resume";
import Education from "./sections/Education";
import Contact from "./sections/Contact";
import CursorGlow from "./components/CursorGlow";
import SkeletonLoader from "./components/SkeletonLoader";
import BackgroundElements from "./components/BackgroundElements";
import { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import DailyStats from "./pages/DailyStats";
import FirestoreManager from "./pages/FirestoreManager";
import Logout from "./pages/Logout";
import NotFound from "./pages/NotFound";
import useAnalytics from "./hooks/useAnalytics";
import { PortfolioProvider, usePortfolioData } from "./hooks/usePortfolioData";

const Portfolio = () => {
  const { trackVisit } = useAnalytics();
  const { loading } = usePortfolioData();
  const location = useLocation();
  
  useEffect(() => {
    // 1. Initial theme load
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    // 2. Track visit
    trackVisit();
  }, [trackVisit]);

  // List of valid sections in your portfolio
  const validSections = ["#home", "#about", "#skills", "#projects", "#education", "#contact", ""];

  // If the URL has a hash that isn't one of your sections, show 404
  if (location.hash && !validSections.includes(location.hash)) {
     return <Navigate to="/404" replace />;
  }

  if (loading) {
    return <SkeletonLoader />;
  }

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Education />
        <Contact />
      </main>
      <Footer />
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <PortfolioProvider>
        <div className="font-sans relative overflow-x-hidden w-full">
          <BackgroundElements />
          <CursorGlow />
          <Routes>
            <Route path="/" element={<Portfolio />} />
            <Route path="/login" element={<Login />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/daily-stats" element={<DailyStats />} />
            <Route path="/admin/database" element={<FirestoreManager />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </PortfolioProvider>
    </BrowserRouter>
  );
}

export default App;

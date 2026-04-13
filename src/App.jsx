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
import BackgroundElements from "./components/BackgroundElements";
import { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import useAnalytics from "./hooks/useAnalytics";

const Portfolio = () => {
  const { trackVisit } = useAnalytics();
  const location = useLocation();
  
  useEffect(() => {
    trackVisit();
  }, [trackVisit]);

  // List of valid sections in your portfolio
  const validSections = ["#home", "#about", "#skills", "#projects", "#education", "#contact", ""];

  // If the URL has a hash that isn't one of your sections, show 404
  if (location.hash && !validSections.includes(location.hash)) {
     return <Navigate to="/404" replace />;
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
      <div className="font-sans relative overflow-x-hidden w-full">
        <BackgroundElements />
        <CursorGlow />
        <Routes>
          <Route path="/" element={<Portfolio />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

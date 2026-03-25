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

function App() {
  return (
    <div className="font-sans relative overflow-x-hidden w-full">
      <BackgroundElements />
      <CursorGlow />
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
    </div>
  );
}

export default App;

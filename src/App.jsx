import { Routes, Route } from 'react-router-dom';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { useApp } from './context/AppContext';
import Loading from './components/Loading/Loading';
import Navbar from './components/Navbar/Navbar';
import CursorEffect from './components/Cursor/CursorEffect';
import Hero from './components/Hero/Hero';
import About from './components/About/About';
import Skills from './components/Skills/Skills';
import Projects from './components/Projects/Projects';
import Experience from './components/Experience/Experience';
import Certificates from './components/Certificates/Certificates';
import Services from './components/Services/Services';
import Statistics from './components/Statistics/Statistics';
import Contact from './components/Contact/Contact';
import Footer from './components/Footer/Footer';
import Admin from './pages/Admin';
import Blog from './components/Blog/Blog';
import './styles/animations.css';

function Home() {
  return (
    <>
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Experience />
      <Certificates />
      <Services />
      <Statistics />
      <Contact />
    </>
  );
}

export default function App() {
  const { loading } = useApp();

  return (
    <>
      {loading && <Loading />}
      <CursorEffect />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/blog" element={<Blog />} />
      </Routes>
      <Footer />
      <SpeedInsights />
    </>
  );
}

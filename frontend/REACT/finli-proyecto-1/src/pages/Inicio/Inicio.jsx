// src/pages/Inicio/Inicio.jsx
import HeroSection from '../../components/Home/HeroSection';
import ServicesSection from '../../components/Home/ServicesSection';
import TestimonialsSection from '../../components/Home/TestimonialsSection';
import ContactSection from '../../components/Home/ContactSection';
import './Inicio.css';

function Inicio() {
  return (
    <main className="container-fluid px-0"> 
        <HeroSection />
        <ServicesSection />
        <TestimonialsSection />
        <ContactSection />
    </main>
  );
}

export default Inicio;
import { useEffect } from 'react';
import './AnimatedBackground.css';

const AnimatedBackground = () => {
  useEffect(() => {
    // Crear partículas
    const particlesContainer = document.getElementById('particles');
    if (particlesContainer) {
      for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.width = `${Math.random() * 5 + 2}px`;
        particle.style.height = particle.style.width;
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.animationDelay = `${Math.random() * 15}s`;
        particle.style.animationDuration = `${Math.random() * 10 + 10}s`;
        particlesContainer.appendChild(particle);
      }
    }

    // Crear burbujas
    const bubblesContainer = document.getElementById('bubbles');
    if (bubblesContainer) {
      for (let i = 0; i < 15; i++) {
        const bubble = document.createElement('div');
        bubble.className = 'bubble';
        bubble.style.left = `${Math.random() * 100}%`;
        bubble.style.animationDelay = `${Math.random() * 15}s`;
        bubble.style.animationDuration = `${Math.random() * 10 + 10}s`;
        bubblesContainer.appendChild(bubble);
      }
    }

    // Cleanup al desmontar
    return () => {
      if (particlesContainer) particlesContainer.innerHTML = '';
      if (bubblesContainer) bubblesContainer.innerHTML = '';
    };
  }, []);

  return (
    <div className="animated-background">
      <div className="shape shape-1"></div>
      <div className="shape shape-2"></div>
      <div className="shape shape-3"></div>
      <div className="shape shape-4"></div>
      <div className="shape shape-5"></div>
      <div className="shape shape-6"></div>
      
      <div className="light-spot light-spot-1"></div>
      <div className="light-spot light-spot-2"></div>
      
      <div className="particles" id="particles"></div>
      <div className="bubbles" id="bubbles"></div>
      
      <div className="waves">
        <div className="wave"></div>
        <div className="wave"></div>
        <div className="wave"></div>
      </div>
    </div>
  );
};

export default AnimatedBackground;
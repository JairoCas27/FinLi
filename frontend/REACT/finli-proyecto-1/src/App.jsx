import React from 'react';
import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import Navbar from './components/Navbar/Navbar'; 
import Footer from './components/Footer/Footer';
import Inicio from './pages/Inicio/Inicio'; 
import Nosotros from './pages/Nosotros/Nosotros';
import Servicios from './pages/Servicios/Servicios';

function App() {
  const [count, setCount] = useState(0);

  return (
    <Router> 
      <Navbar /> 
      <main> 
        <Routes> 
          {/* Ruta de Inicio */}
          <Route path="/" element={<Inicio />} /> 
          
          {/* Añadir las nuevas rutas que definiste en el Navbar: */}
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/servicios" element={<Servicios />} />
          {/*<Route path="/login" element={<Login />} /> */}
          
          <Route path="*" element={<h2>404 - Página no encontrada</h2>} />
        </Routes>
      </main>
      <Footer /> 
    </Router>
  );
}

export default App

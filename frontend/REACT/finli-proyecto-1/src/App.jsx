import React from 'react';
import { useState } from 'react'
import './App.css'
import Navbar from './components/Navbar/Navbar'; 
import Footer from './components/Footer/Footer';
import Inicio from './pages/Inicio/Inicio'; 

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Navbar /> {/* Se renderiza arriba de todo */}
      
      {/* El componente Inicio (tu única página) se carga en el centro */}
      <main className="container-fluid p-0"> 
        <Inicio />
      </main>
      
      <Footer /> {/* Se renderiza abajo de todo */}
    </>
  )
}

export default App

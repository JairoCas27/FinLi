import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './components/AuthContext/AuthContext';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';

// Páginas públicas
import Login from './pages/Autenticacion/Login';
import Register from './pages/Autenticacion/Register';
import RecoverPassword from './pages/Autenticacion/RecoverPassword';
import NewPassword from './pages/Autenticacion/NewPassword';
import Inicio from './pages/Inicio/Inicio';
import Nosotros from './pages/Nosotros/Nosotros';
import Servicios from './pages/Servicios/Servicios';

// Páginas protegidas
import Usuario from './pages/Usuario/Usuario';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<Inicio />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/servicios" element={<Servicios />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Register />} />
          <Route path="/recuperar-contrasena" element={<RecoverPassword />} />
          <Route path="/nueva-contrasena" element={<NewPassword />} />

          {/* Rutas protegidas */}
          <Route 
            path="/usuario" 
            element={
              <ProtectedRoute>
                <Usuario />
              </ProtectedRoute>
            } 
          />

          {/* Ruta por defecto */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
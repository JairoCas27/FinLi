import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../components/AuthContext/AuthContext';
import AnimatedBackground from '../../components/AnimatedBackground/AnimatedBackground';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import './Login.css';

const RecoverPassword = () => {
  const navigate = useNavigate();
  const { recoverPassword } = useAuth();
  
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      alert('Por favor, ingrese su correo electrónico');
      return;
    }

    setIsLoading(true);
    
    const result = await recoverPassword(email);
    
    setIsLoading(false);
    
    if (result.success) {
      // Mostrar notificación de éxito
      setShowNotification(true);
      
      // Redirigir después de 2.5 segundos
      setTimeout(() => {
        navigate('/nueva-contrasena', { state: { email } });
      }, 2500);
      
      // Ocultar notificación después de 5 segundos
      setTimeout(() => {
        setShowNotification(false);
      }, 5000);
    } else {
      alert(result.message);
    }
  };

  const closeNotification = () => {
    setShowNotification(false);
  };

  return (
    <>
      <AnimatedBackground />
      
      {/* Notificación de éxito */}
      <div className={`notification ${showNotification ? 'show' : ''}`}>
        <i className="bi bi-check-circle-fill notification-icon"></i>
        <div className="notification-content">
          <strong>¡Éxito!</strong>
          <p className="mb-0">Código de recuperación enviado exitosamente.</p>
        </div>
        <button className="notification-close" onClick={closeNotification}>
          <i className="bi bi-x-lg"></i>
        </button>
      </div>

      <Navbar showLoginButton={true} />
      
      <section className="form-section">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-8 col-lg-6">
              <div className="card card-shadow register-card">
                <div className="logo-header">
                  <img 
                    src="/frontend/public/img/Logo/LogoFinLi.png" 
                    alt="Logo FinLi" 
                    width="100" 
                    height="100"
                  />
                  <h1>FinLi</h1>
                  <p>RECUPERAR CONTRASEÑA</p>
                </div>
                
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      Introduzca su correo electrónico
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      placeholder="Ejm. utepino@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <button 
                    type="submit" 
                    className={`btn btn-custom mt-3 ${isLoading ? 'btn-loading' : ''}`}
                    disabled={isLoading}
                  >
                    <span>{isLoading ? 'Enviando código de recuperación...' : 'Enviar'}</span>
                  </button>

                  <div className="login-redirect">
                    <Link to="/registro" className="login-link">
                      Crear Cuenta
                    </Link>
                  </div>
                  
                  <div className="login-redirect">
                    <Link to="/" className="login-link">
                      Regresar al Inicio
                    </Link>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default RecoverPassword;
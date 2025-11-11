import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../components/AuthContext/AuthContext';
import AnimatedBackground from '../../components/AnimatedBackground/AnimatedBackground';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import './Login.css';

const NewPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { resetPassword } = useAuth();
  
  const [formData, setFormData] = useState({
    email: location.state?.email || '',
    codigo: '',
    contrasena: '',
    confirmarContrasena: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Estado del temporizador
  const [timeLeft, setTimeLeft] = useState(60);
  const [isExpired, setIsExpired] = useState(false);

  // Temporizador de 60 segundos
  useEffect(() => {
    if (timeLeft <= 0) {
      setIsExpired(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleResendCode = async () => {
    if (!formData.email) {
      alert('No se encontró el correo electrónico');
      return;
    }

    setIsLoading(true);
    
    // Simular reenvío de código (ajusta según tu backend)
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsLoading(false);
    setTimeLeft(60);
    setIsExpired(false);
    alert('Código reenviado exitosamente');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.codigo || !formData.contrasena || !formData.confirmarContrasena) {
      alert("Por favor completa todos los campos.");
      return;
    }

    if (formData.contrasena !== formData.confirmarContrasena) {
      alert("Las contraseñas no coinciden.");
      return;
    }

    if (isExpired) {
      alert("El código ha expirado. Por favor, solicita uno nuevo.");
      return;
    }

    setIsLoading(true);
    
    const result = await resetPassword(formData.email, formData.codigo, formData.contrasena);
    
    setIsLoading(false);
    
    if (result.success) {
      alert(result.message);
      navigate('/login');
    } else {
      alert(result.message);
    }
  };

  return (
    <>
      <AnimatedBackground />
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
                  <p>NUEVA CONTRASEÑA</p>
                  
                  {/* Temporizador */}
                  <div className="timer-container">
                    <div className={`timer ${isExpired ? 'expired' : ''}`}>
                      {isExpired 
                        ? 'El código ha expirado' 
                        : `El código expira en ${timeLeft} segundos`
                      }
                    </div>
                    {isExpired && (
                      <a 
                        className="resend-link" 
                        onClick={handleResendCode}
                        style={{ display: 'inline', cursor: 'pointer' }}
                      >
                        Reenviar código
                      </a>
                    )}
                  </div>
                </div>
                
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      Correo electrónico
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      placeholder="Ejm. utepino@gmail.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="codigo" className="form-label">
                      Código de Recuperación
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="codigo"
                      placeholder="XXX-XXX"
                      value={formData.codigo}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="contrasena" className="form-label">
                      Nueva Contraseña
                    </label>
                    <div className="password-container">
                      <input
                        type={showPassword ? "text" : "password"}
                        className="form-control"
                        id="contrasena"
                        placeholder="**********"
                        value={formData.contrasena}
                        onChange={handleChange}
                        required
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        <i className={`bi bi-eye${showPassword ? '-slash' : ''}`}></i>
                      </button>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="confirmarContrasena" className="form-label">
                      Confirmar Contraseña
                    </label>
                    <div className="password-container">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        className="form-control"
                        id="confirmarContrasena"
                        placeholder="**********"
                        value={formData.confirmarContrasena}
                        onChange={handleChange}
                        required
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        <i className={`bi bi-eye${showConfirmPassword ? '-slash' : ''}`}></i>
                      </button>
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    className="btn btn-custom mt-3"
                    disabled={isLoading || isExpired}
                  >
                    {isLoading ? 'Actualizando...' : 'Actualizar Contraseña'}
                  </button>
                  
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

export default NewPassword;
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../components/AuthContext/AuthContext';
import AnimatedBackground from '../../components/AnimatedBackground/AnimatedBackground';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    contrasena: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.contrasena) {
      alert("Por favor completa todos los campos.");
      return;
    }

    setIsLoading(true);
    
    const result = await login(formData.email, formData.contrasena);
    
    setIsLoading(false);
    
    if (result.success) {
      alert(result.message);
      navigate('/usuario'); 
    } else {
      alert(result.message);
    }
  };

  return (
    <>
      <AnimatedBackground />
      <Navbar />
      
      <section className="form-section">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-8 col-lg-6">
              <div className="card card-shadow register-card">
                <div className="logo-header">
                  <img 
                    src="/img/Logo/LogoFinLi.png" 
                    alt="Logo FinLi" 
                    width="100" 
                    height="100"
                  />
                  <h1>FinLi</h1>
                  <p>INICIAR SESIÓN</p>
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
                    <label htmlFor="contrasena" className="form-label">
                      Contraseña
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
                  
                  <Link to="/recuperar-contrasena" className="login-link">
                    ¿Olvidaste tu contraseña?
                  </Link>
                  
                  <button 
                    type="submit" 
                    className="btn btn-custom mt-4"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Iniciando sesión...' : 'Enviar'}
                  </button>
                  
                  <div className="login-redirect">
                    ¿Aún no tienes una cuenta?{' '}
                    <Link to="/registro" className="login-link">
                      Registrarse aquí
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

export default Login;
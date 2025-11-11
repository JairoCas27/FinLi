import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../components/AuthContext/AuthContext';
import AnimatedBackground from '../../components/AnimatedBackground/AnimatedBackground';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import './Login.css';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  
  const [formData, setFormData] = useState({
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    fechaNacimiento: '',
    edad: '',
    email: '',
    contrasena: '',
    confirmarContrasena: '',
    terms: false
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Calcular edad automáticamente
  useEffect(() => {
    if (formData.fechaNacimiento) {
      const nacimiento = new Date(formData.fechaNacimiento);
      const hoy = new Date();
      let edad = hoy.getFullYear() - nacimiento.getFullYear();
      const mesDiff = hoy.getMonth() - nacimiento.getMonth();
      
      if (mesDiff < 0 || (mesDiff === 0 && hoy.getDate() < nacimiento.getDate())) {
        edad--;
      }
      
      if (!isNaN(edad) && edad >= 0) {
        setFormData(prev => ({ ...prev, edad: edad }));
      }
    }
  }, [formData.fechaNacimiento]);

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validaciones
    if (!formData.nombre || !formData.apellidoPaterno || !formData.apellidoMaterno || 
        !formData.edad || !formData.email || !formData.contrasena || !formData.confirmarContrasena) {
      alert("Por favor completa todos los campos.");
      return;
    }

    if (formData.contrasena !== formData.confirmarContrasena) {
      alert("Las contraseñas no coinciden.");
      return;
    }

    if (!formData.terms) {
      alert("Debes aceptar los términos y condiciones.");
      return;
    }

    setIsLoading(true);
    
    // Preparar datos para enviar
    const dataToSend = {
      nombre: formData.nombre,
      apellidoPaterno: formData.apellidoPaterno,
      apellidoMaterno: formData.apellidoMaterno,
      edad: parseInt(formData.edad, 10),
      email: formData.email,
      contrasena: formData.contrasena,
      confirmarContrasena: formData.confirmarContrasena
    };
    
    const result = await register(dataToSend);
    
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
      <Navbar showRegisterButton={false} />
      
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
                  <p>REGISTRARSE</p>
                </div>
                
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="nombre" className="form-label">Nombres</label>
                    <input
                      type="text"
                      className="form-control"
                      id="nombre"
                      placeholder="Nombres completos"
                      value={formData.nombre}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Apellidos</label>
                    <div className="two-cols">
                      <input
                        type="text"
                        className="form-control"
                        id="apellidoPaterno"
                        placeholder="Apellido paterno"
                        value={formData.apellidoPaterno}
                        onChange={handleChange}
                        required
                      />
                      <input
                        type="text"
                        className="form-control"
                        id="apellidoMaterno"
                        placeholder="Apellido materno"
                        value={formData.apellidoMaterno}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Fecha de Nacimiento</label>
                    <div className="two-cols">
                      <input
                        type="date"
                        className="form-control"
                        id="fechaNacimiento"
                        value={formData.fechaNacimiento}
                        onChange={handleChange}
                        required
                      />
                      <input
                        type="number"
                        className="form-control"
                        id="edad"
                        placeholder="Edad"
                        value={formData.edad}
                        readOnly
                      />
                    </div>
                  </div>
                  
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
                  
                  <div className="mb-3 form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="terms"
                      checked={formData.terms}
                      onChange={handleChange}
                    />
                    <label className="form-check-label" htmlFor="terms">
                      He leído y acepto los{' '}
                      <a href="#" className="terms-link">
                        Términos y Condiciones
                      </a>
                    </label>
                  </div>
                  
                  <button 
                    type="submit" 
                    className="btn btn-custom mt-4"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Registrando...' : 'Enviar'}
                  </button>
                  
                  <div className="login-redirect">
                    ¿Ya tienes una cuenta?{' '}
                    <Link to="/login" className="login-link">
                      Inicia sesión aquí
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

export default Register;
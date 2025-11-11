import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ showRegisterButton = false, showLoginButton = false }) => {
    const location = useLocation();
    const currentPath = location.pathname;
    
    const getLinkClass = (path) => {
        let isActive = false;

        if (path === '/') {
            isActive = currentPath === '/';
        } else {
            isActive = currentPath.startsWith(path);
        }

        return `nav-link ${isActive ? 'active' : ''}`;
    };

    return (
        <nav className="navbar navbar-expand-lg bg-white py-3">
            <div className="container">
                <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
                    <img 
                        src="/img/Logo/LogoFinLi.png" 
                        alt="Logo FinLi" 
                        width="50" 
                        height="50" 
                    />
                    <span className="fw-semibold fs-5">FinLi</span>
                </Link>

                <button 
                    className="navbar-toggler" 
                    type="button" 
                    data-bs-toggle="collapse" 
                    data-bs-target="#navbarNav" 
                    aria-controls="navbarNav" 
                    aria-expanded="false" 
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav mx-auto gap-2 gap-md-4">
                        <li className="nav-item">
                            <Link className={getLinkClass('/')} to="/">Inicio</Link>
                        </li>
                        <li className="nav-item">
                            <Link className={getLinkClass('/nosotros')} to="/nosotros">Nosotros</Link>
                        </li>
                        <li className="nav-item">
                            <Link className={getLinkClass('/servicios')} to="/servicios">Servicios</Link>
                        </li>
                    </ul>

                    <div className="d-flex gap-2">
                        {showRegisterButton && (
                            <Link to="/registro" className="btn btn-custom">
                                Registrarse
                            </Link>
                        )}
                        {showLoginButton && (
                            <Link to="/login" className="btn btn-custom">
                                Iniciar Sesión
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
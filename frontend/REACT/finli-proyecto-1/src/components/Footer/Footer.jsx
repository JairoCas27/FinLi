// src/components/Footer/Footer.jsx
import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap'; 
import { Link } from 'react-router-dom';
function Footer() {

    const [showModal, setShowModal] = useState(null);

    const handleClose = () => setShowModal(null);
    const handleShow = (modalType) => setShowModal(modalType);

    return (
        <footer className="footer">
            <div className="container">
                <div className="row">
                    <div className="col-lg-4 mb-5 mb-lg-0 logo-section">
                        <div id="img" className="d-flex justify-content-center justify-content-lg-start align-items-center gap-3 mb-4">
                            <img src="/img/Logo/LogoFinLi2.png" alt="Logo FinLi" width="50" height="70" /> 
                        </div>
                        <p className="footer-content text-center text-lg-start">Toma el control de tu dinero, de manera sencilla y con ayuda real.</p>
                    </div>
                    
                    <div className="col-lg-2 col-md-4 mb-5 mb-md-0">
                        <h5 className="footer-title text-center text-md-start">Navegación</h5>
                        <ul className="footer-links">
                            <li className="text-center text-md-start"><a href="/">Inicio</a></li>
                            <li className="text-center text-md-start"><a href="/nosotros">Nosotros</a></li>
                            <li className="text-center text-md-start"><a href="/servicios">Servicios</a></li>
                        </ul>
                    </div>
                    
                    {/* Columna de Legal */}
                    <div className="col-lg-2 col-md-4 mb-5 mb-md-0">
                        <h5 className="footer-title text-center text-md-start">Legal</h5>
                        <ul className="footer-links">
                            {/* ENLACE DE TÉRMINOS Y CONDICIONES */}
                            <li className="text-center text-md-start">
                                {/* Al hacer clic, abre el modal 'terminos' */}
                                <a href="#" onClick={(e) => { e.preventDefault(); handleShow('terminos'); }}>
                                    Términos y Condiciones
                                </a>
                            </li>
                            {/* ENLACE DE POLÍTICA DE PRIVACIDAD */}
                            <li className="text-center text-md-start">
                                {/* Al hacer clic, abre el modal 'privacidad' */}
                                <a href="#" onClick={(e) => { e.preventDefault(); handleShow('privacidad'); }}>
                                    Política de Privacidad
                                </a>
                            </li>
                        </ul>
                    </div>
                    
                    <div className="col-lg-4 col-md-4">
                        <h5 className="footer-title text-center text-md-start">Conéctate con nosotros</h5>
                        <div className="social-icons mb-4 text-center text-md-start">
                            <a href="#"><i className="bi bi-facebook"></i></a>
                            <a href="#"><i className="bi bi-twitter"></i></a>
                            <a href="#"><i className="bi bi-instagram"></i></a>
                            <a href="#"><i className="bi bi-linkedin"></i></a>
                        </div>
                        <p className="footer-content text-center text-md-start">Síguenos en nuestras redes sociales para mantenerte actualizado.</p>
                    </div>
                </div>
            </div>
            <div className="copyright-container">
                <p className="copyright">© 2025 FinLi. Todos los derechos reservados.</p>
            </div>

            <Modal show={showModal === 'terminos'} onHide={handleClose} centered size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Términos y Condiciones de Uso</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {/* Contenido REAL de los Términos */}
                    <h5>1. Aceptación</h5>
                    <p>Al acceder o utilizar los servicios de FinLi, usted acepta estar sujeto a estos Términos y Condiciones. Si no está de acuerdo con alguna parte de los términos, no debe utilizar nuestros servicios.</p>
                    <h5>2. Servicios</h5>
                    <p>FinLi provee una plataforma de gestión financiera personal para ayudarle a rastrear ingresos, gastos y establecer metas. La información provista no constituye asesoría financiera legal.</p>
                    {/* ... Más contenido ... */}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>
            
            {/* Modal de Política de Privacidad */}
            <Modal show={showModal === 'privacidad'} onHide={handleClose} centered size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Política de Privacidad de Datos</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {/* Contenido REAL de la Política */}
                    <h5>1. Recolección de Información</h5>
                    <p>Recopilamos información que usted nos proporciona directamente, como nombre, correo electrónico y datos financieros para la funcionalidad de la aplicación.</p>
                    <h5>2. Uso de Datos</h5>
                    <p>Utilizamos su información para operar, mantener y mejorar la plataforma, y para comunicarnos con usted sobre actualizaciones del servicio. Sus datos nunca serán compartidos con terceros sin su consentimiento expreso.</p>
                    {/* ... Más contenido ... */}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>

        </footer>
    );
}

export default Footer;
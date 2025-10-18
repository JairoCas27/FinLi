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
                <Modal.Header closeButton className="border-0 pb-0">
                    <Modal.Title className="fw-bold text-dark">Términos y Condiciones de Uso</Modal.Title>
                </Modal.Header> 
                <Modal.Body className="pt-3">
                    <div className="modal-content-scrollable"> 
                        <h5 className="fw-bold mb-3 text-success">1. Aceptación de los Términos</h5>
                        <p className="text-muted small">
                            Al acceder y utilizar la aplicación FinLi y sus servicios asociados, usted acepta estar obligado por estos Términos y Condiciones de Uso. 
                            Si usted no está de acuerdo con la totalidad de estos términos, no debe utilizar la Plataforma. 
                            Nos reservamos el derecho de modificar estos términos en cualquier momento, y su uso continuado constituye la aceptación de dichas modificaciones.
                        </p>

                        <h5 className="fw-bold mt-4 mb-3 text-success">2. Descripción de los Servicios</h5>
                        <p className="text-muted small">
                            FinLi es una herramienta de gestión financiera personal diseñada para ayudar a los usuarios a rastrear ingresos, categorizar gastos, establecer presupuestos y visualizar análisis de sus finanzas. 
                            La Plataforma es una herramienta informativa y de organización; no ofrecemos asesoramiento financiero, legal o fiscal. Usted es el único responsable de las decisiones financieras que tome basadas en la información presentada por FinLi.
                        </p>

                        <h5 className="fw-bold mt-4 mb-3 text-success">3. Cuentas de Usuario y Seguridad</h5>
                        <ul className="text-muted small ps-4">
                            <li className="mb-2">Para acceder a la mayoría de las funcionalidades, se requiere registrar una cuenta y proporcionar información veraz.</li>
                            <li className="mb-2">Usted es responsable de mantener la confidencialidad de su contraseña y es el único responsable de todas las actividades que ocurran bajo su cuenta.</li>
                            <li>Debe notificarnos inmediatamente sobre cualquier uso no autorizado de su cuenta.</li>
                        </ul>

                        <h5 className="fw-bold mt-4 mb-3 text-success">4. Derechos de Propiedad Intelectual</h5>
                        <p className="text-muted small">
                            Todo el contenido, características y funcionalidad de la Plataforma (incluyendo diseños, texto, gráficos, logotipos e iconos) son propiedad exclusiva de FinLi y están protegidos por las leyes de derechos de autor y propiedad intelectual. 
                            No se le concede ningún derecho o licencia para usar las marcas registradas de FinLi sin nuestro consentimiento previo por escrito.
                        </p>
                        
                        <h5 className="fw-bold mt-4 mb-3 text-success">5. Terminación</h5>
                        <p className="text-muted small">
                            Podemos suspender o terminar su acceso a la Plataforma inmediatamente, sin previo aviso o responsabilidad, por cualquier motivo, incluyendo, sin limitación, si usted incumple estos Términos y Condiciones.
                        </p>
                    </div>
                </Modal.Body>
                <Modal.Footer className="border-0 pt-0">
                    <Button variant="secondary" onClick={handleClose}>
                        Entendido
                    </Button>
                </Modal.Footer>
            </Modal>
            
            <Modal show={showModal === 'privacidad'} onHide={handleClose} centered size="lg">
                <Modal.Header closeButton className="border-0 pb-0">
                    <Modal.Title className="fw-bold text-dark">Política de Privacidad de Datos</Modal.Title>
                </Modal.Header>
                <Modal.Body className="pt-3"> 
                    <div className="modal-content-scrollable">
                        <h5 className="fw-bold mb-3 text-success">1. Información que Recolectamos</h5>
                        <p className="text-muted small">
                            Recopilamos la siguiente información necesaria para la prestación de nuestros servicios: 
                            (a) Datos Personales: Nombre, correo electrónico y credenciales de acceso. 
                            (b) Datos Financieros: Transacciones, saldos de cuentas y presupuestos, que son manejados de forma encriptada. 
                            (c) Datos de Uso: Información sobre cómo utiliza la Plataforma (ej. funciones visitadas) para mejorar la experiencia de usuario.
                        </p>

                        <h5 className="fw-bold mt-4 mb-3 text-success">2. Uso de la Información</h5>
                        <p className="text-muted small">
                            Utilizamos los datos recopilados para los siguientes propósitos:
                        </p>
                        <ul className="text-muted small ps-4">
                            <li className="mb-2">Operar y mantener la funcionalidad de FinLi, permitiendo el registro y el análisis de sus movimientos financieros.</li>
                            <li className="mb-2">Comunicarnos con usted sobre actualizaciones, soporte técnico y avisos importantes.</li>
                            <li>Personalizar su experiencia y mejorar la Plataforma a través del análisis de tendencias de uso (sin identificarle personalmente).</li>
                        </ul>

                        <h5 className="fw-bold mt-4 mb-3 text-success">3. Compartición y Revelación de Datos</h5>
                        <p className="text-muted small">
                            Su información financiera y personal nunca será vendida, alquilada o compartida con terceros para fines de marketing. Solo podemos compartir sus datos en las siguientes circunstancias limitadas:
                        </p>
                        <ul className="text-muted small ps-4">
                            <li className="mb-2">Con proveedores de servicios esenciales (ej. alojamiento web, análisis) que están obligados a mantener la confidencialidad.</li>
                            <li>Para cumplir con una obligación legal o requerimiento judicial válido.</li>
                        </ul>

                        <h5 className="fw-bold mt-4 mb-3 text-success">4. Seguridad y Retención de Datos</h5>
                        <p className="text-muted small">
                            Implementamos medidas de seguridad técnicas y administrativas estándar de la industria, incluyendo cifrado de datos, para proteger su información contra el acceso no autorizado y la divulgación. 
                            Retenemos sus datos mientras su cuenta permanezca activa o sea necesario para prestarle los servicios.
                        </p>

                        <h5 className="fw-bold mt-4 mb-3 text-success">5. Sus Derechos de Privacidad</h5>
                        <p className="text-muted small">
                            Usted tiene el derecho de acceder, rectificar, cancelar u oponerse al procesamiento de sus datos personales ("Derechos ARCO"). Para ejercer estos derechos, por favor, contáctenos utilizando la información de contacto provista en la Plataforma.
                        </p>
                    </div>
                </Modal.Body>
                
                <Modal.Footer className="border-0 pt-0">
                    <Button variant="secondary" onClick={handleClose}>
                        Entendido
                    </Button>
                </Modal.Footer>
            </Modal>

        </footer>
    );
}

export default Footer;
// src/components/Footer/Footer.jsx

function Footer() {
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
                    
                    <div className="col-lg-2 col-md-4 mb-5 mb-md-0">
                        <h5 className="footer-title text-center text-md-start">Legal</h5>
                        <ul className="footer-links">
                            <li className="text-center text-md-start"><a href="#">Términos y Condiciones</a></li>
                            <li className="text-center text-md-start"><a href="#">Política de Privacidad</a></li>
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
        </footer>
    );
}

export default Footer;
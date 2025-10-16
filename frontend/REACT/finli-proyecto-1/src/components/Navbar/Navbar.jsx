import { Link } from 'react-router-dom'; // ¡Paso 1: Importar Link!

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg bg-white py-3">
        <div className="container">
            
            <Link className="navbar-brand d-flex align-items-center gap-2" to="/"> 
                <img src="/img/Logo/LogoFinLi.png" alt="Logo FinLi" width="50" height="50" />
                <span className="fw-semibold fs-5">FinLi</span>
            </Link>
            
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button> 

            <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav mx-auto gap-2 gap-md-4">
                    <li className="nav-item">
                        <Link className="nav-link active" to="/">Inicio</Link> 
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/nosotros">Nosotros</Link> 
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/servicios">Servicios</Link> 
                    </li>
                </ul>
                
                <div className="d-flex">
                    <Link to="/login" className="btn btn-custom">Iniciar Sesión</Link> 
                </div>
            </div>
        </div>
    </nav>
  );
}

export default Navbar;
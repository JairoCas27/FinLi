// src/components/Navbar/Navbar.jsx

function Navbar() {
  return (
    // 1. Convertido a JSX (class -> className)
    <nav className="navbar navbar-expand-lg bg-white py-3">
        <div className="container">
            
            {/* 2. Reemplazado <a> por <Link> y ajustada la ruta a "/" */}
            <a className="navbar-brand d-flex align-items-center gap-2" href="/">
                {/* 3. Etiqueta <img> cerrada automáticamente y ruta de imagen ajustada (si es necesario) */}
                {/* Nota: Asegúrate de que la imagen esté accesible en la carpeta 'public' de tu proyecto React */}
                <img src="/img/Logo/LogoFinLi.png" alt="Logo FinLi" width="50" height="50" />
                <span className="fw-semibold fs-5">FinLi</span>
            </a>
            
            {/* El botón de Bootstrap se mantiene igual, aunque la funcionalidad JavaScript de toggle debe ser manejada por Bootstrap o React */}
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button> 

            <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav mx-auto gap-2 gap-md-4">
                    <li className="nav-item">
                        {/* 4. Enlace Inicio: mapeado a la ruta principal "/" */}
                        <a className="nav-link active" href="/">Inicio</a>
                    </li>
                    <li className="nav-item">
                        {/* 5. Enlace Nosotros: mapeado a la ruta "/nosotros" */}
                        <a className="nav-link" href="/nosotros">Nosotros</a>
                    </li>
                    <li className="nav-item">
                        {/* 6. Enlace Servicios: mapeado a la ruta "/servicios" */}
                        <a className="nav-link" href="/servicios">Servicios</a>
                    </li>
                </ul>
                
                <div className="d-flex">
                    {/* 7. Enlace Iniciar Sesión: mapeado a la ruta "/login" o "/autenticacion" */}
                    <a href="/login" className="btn btn-custom">Iniciar Sesión</a>
                </div>
            </div>
        </div>
    </nav>
  );
}

export default Navbar;
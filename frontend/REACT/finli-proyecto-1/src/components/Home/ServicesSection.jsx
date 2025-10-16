import { Link } from 'react-router-dom';

// Datos de los servicios (opcional: esto podría venir del backend más tarde)
const serviceCards = [
    {
        imgSrc: "/img/Contenido/gestion.png",
        title: "Gestión de Ingresos y Gastos",
        linkTo: "/servicios#gestion", // Enlace a la sección dentro de la vista de Servicios
        alt: "Gestión de Ingresos y Gastos"
    },
    {
        imgSrc: "/img/Contenido/reporte.png",
        title: "Análisis y Reportes Visuales",
        linkTo: "/servicios#analisis",
        alt: "Análisis y Reportes Visuales"
    },
    {
        imgSrc: "/img/Contenido/pagos.png",
        title: "Pagos y Presupuestos Inteligentes",
        linkTo: "/servicios#pagos",
        alt: "Pagos y Presupuestos Inteligentes"
    }
];

// Componente Tarjeta de Servicio
const ServiceCard = ({ imgSrc, title, linkTo, alt }) => (
    <div className="col-md-4">
        <div className="card h-100 border-0 card-shadow text-center p-4">
            <img
                src={imgSrc}
                alt={alt}
                className="card-img-top mx-auto"
                style={{ maxWidth: '180px' }} 
            />
            <div className="card-body">
                <h5 className="card-title fw-semibold">{title}</h5>
                <Link to={linkTo} className="btn btn-custom mt-3">Ver más</Link>
            </div>
        </div>
    </div>
);

function ServicesSection() {
    return (
        <section className="rounded-3 p-5 bg-plomo my-5">
            <div className="container">
                <div className="text-center mb-4">
                    <h3 className="fw-semibold">Nuestros Servicios</h3>
                    <p className="text-muted fst-italic mt-2">"Descubre cómo FinLi te ayuda a alcanzar tus metas con nuestras herramientas clave."</p>
                </div>
                <div className="row g-4">
                    {serviceCards.map((card, index) => (
                        <ServiceCard
                            key={index}
                            imgSrc={card.imgSrc}
                            title={card.title}
                            linkTo={card.linkTo}
                            alt={card.alt}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

export default ServicesSection;
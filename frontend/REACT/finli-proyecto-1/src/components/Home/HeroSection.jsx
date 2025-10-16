// src/components/Home/HeroSection.jsx

import { Link } from 'react-router-dom';
import Carousel from 'react-bootstrap/Carousel'; 

function HeroSection() {
    return (
        <section className="hero-section rounded-3 my-0">
            
            <Carousel id="heroCarousel" className="hero-carousel" controls={true} indicators={true}> 
                
                <Carousel.Item className="carousel-item">
                    <img 
                        src="/img/Contenido/principal_01.png" 
                        className="d-block w-100" 
                        alt="Control financiero" 
                    />
                </Carousel.Item>
                
                <Carousel.Item className="carousel-item">
                    <img 
                        src="/img/Contenido/principal_02.png" 
                        className="d-block w-100" 
                        alt="Gestión de finanzas" 
                    />
                </Carousel.Item>

                <Carousel.Item className="carousel-item">
                    <img 
                        src="/img/Contenido/principal_03.png" 
                        className="d-block w-100" 
                        alt="Reportes financieros" 
                    />
                </Carousel.Item>
            </Carousel>
            
            <div className="hero-overlay"></div>
            <div className="container-fluid hero-content">
                <div className="row">
                    <div className="col-md-5 offset-md-1">
                        <h1 className="display-4 fw-medium">Toma el control de tu dinero,<br/>de forma sencilla</h1>
                        <Link to="/login" className="btn btn-custom">Comenzar Ahora</Link>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default HeroSection;
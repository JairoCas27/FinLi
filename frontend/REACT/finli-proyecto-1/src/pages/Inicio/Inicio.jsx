// src/pages/Inicio/Inicio.jsx
import React, { useState, useEffect } from 'react'; 
import './Inicio.css'; 

function Inicio() {
    // Definición del estado para los campos del formulario
    const [formData, setFormData] = useState({
        nombre: '',
        correo: '',
        mensaje: ''
    });

    // Maneja los cambios en cualquier input del formulario
    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [id]: value
        }));
    };

    // Maneja el envío del formulario
    const handleSubmit = (e) => {
        e.preventDefault(); 
        
        console.log("Datos enviados:", formData);
        alert(`Mensaje de ${formData.nombre} enviado con éxito!`);
        
        // Limpiar el formulario después del envío (opcional)
        setFormData({
            nombre: '',
            correo: '',
            mensaje: ''
        });
    };

    //Efecto para los carruseles
    useEffect(() => {
        if (typeof window.bootstrap !== 'undefined') {
            const heroCarouselElement = document.getElementById('heroCarousel');
            if (heroCarouselElement) {
                new window.bootstrap.Carousel(heroCarouselElement, {
                    interval: 4000, 
                    ride: 'carousel'
                });
            }

            const testimonialCarouselElement = document.getElementById('testimonialCarousel');
            if (testimonialCarouselElement) {
                new window.bootstrap.Carousel(testimonialCarouselElement, {
                    interval: 4000, 
                    ride: 'carousel'
                });
            }
        }
    }, []);

    return (
        <>
        <main className="container-fluid px-0">
            <section className="hero-section r my-0">
                {/* Carrusel de imágenes de fondo */}
                <div id="heroCarousel" className="carousel slide hero-carousel" data-bs-ride="carousel">
                    <div className="carousel-inner">
                        <div className="carousel-item active">
                            <img src="./img/Contenido/principal_01.png" className="d-block w-100" alt="Control financiero" />
                        </div>
                        <div className="carousel-item">
                            <img src="./img/Contenido/principal_02.png" className="d-block w-100" alt="Gestión de finanzas" />
                        </div>
                        <div className="carousel-item">
                            <img src="./img/Contenido/principal_03.png" className="d-block w-100" alt="Reportes financieros" />
                        </div>
                    </div>
                    <button className="carousel-control-prev" type="button" data-bs-target="#heroCarousel" data-bs-slide="prev">
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Anterior</span>
                    </button>
                    <button className="carousel-control-next" type="button" data-bs-target="#heroCarousel" data-bs-slide="next">
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Siguiente</span>
                    </button>
                </div>
                <div className="hero-overlay"></div>
                <div className="container-fluid hero-content">
                    <div className="row">
                        <div className="col-md-5 offset-md-1">
                            <h1 className="display-4 fw-medium">Toma el control de tu dinero,<br/>de forma sencilla</h1>
                            <a href="/login" className="btn btn-custom">Comenzar Ahora</a>
                        </div>
                    </div>
                </div>
            </section>
            
            {/* Servicios */}
            <section className="p-5 bg-plomo mt-5">
                <div className="text-center mb-5">
                    <h3 className="fw-semibold">Nuestros Servicios</h3>
                    <p className="text-muted fst-italic mt-2">"Descubre cómo FinLi te ayuda a alcanzar tus metas con nuestras herramientas clave."</p>
                </div>
                <div className="row g-4">
                    {/* card 1 */}
                    <div className="col-md-4">
                        <div className="card h-100 border-0 card-shadow text-center p-4">
                            <img src="/img/Contenido/gestion.png" alt="Gestión de Ingresos y Gastos" className="card-img-top mx-auto" style={{maxWidth: '200px'}} />
                            <div className="card-body">
                                <h5 className="card-title fw-semibold">Gestión de Ingresos y Gastos</h5>
                                <a href="/servicios#gestion" className="btn btn-custom mt-3">Ver más</a>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card h-100 border-0 card-shadow text-center p-4">
                            <img src="/img/Contenido/reporte.png" alt="Análisis y Reportes Visuales" className="card-img-top mx-auto" style={{maxWidth: '200px'}} />
                            <div className="card-body">
                                <h5 className="card-title fw-semibold">Análisis y Reportes Visuales</h5>
                                <a href="/servicios#analisis" className="btn btn-custom mt-3">Ver más</a>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card h-100 border-0 card-shadow text-center p-4">
                            <img src="/img/Contenido/pagos.png" alt="Pagos y Presupuestos Inteligentes" className="card-img-top mx-auto" style={{maxWidth: '200px'}} />
                            <div className="card-body">
                                <h5 className="card-title fw-semibold">Pagos y Presupuestos Inteligentes</h5>
                                <a href="/servicios#pagos" className="btn btn-custom mt-3">Ver más</a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            

            {/* Comentarios de los usuarios con Carrusel */}
            <section className="p-5 bg-mint mt-5">
               <div className="text-center mb-5">
                     <h4 className="fw-semibold">Lo que nuestros usuarios dicen de FinLi...</h4>
                     <p className="text-muted">Descubre cómo FinLi está ayudando a cientos de jóvenes a transformar su relación con el dinero.</p>
             </div>
    
                 {/* Carrusel de testimonios */}
                <div id="testimonialCarousel" className="carousel slide testimonial-carousel" data-bs-ride="carousel">
                    <div className="carousel-inner">
                
                {/* Slide 1 */}
                <div className="carousel-item active">
                    <div className="row g-4">
                        <div className="col-md-6">
                            <div className="card border-0 card-shadow p-4 testimonial-card">
                                <div className="testimonial-header">
                                    <img src="/img/Usuarios/Usuario1.png" alt="Perfil" className="testimonial-img" />
                                    <div className="testimonial-info">
                                        <div className="testimonial-name">Dina Boluarte</div>
                                        <p className="testimonial-date">Hace 5 mim</p>
                                    </div>
                                </div>
                                <div className="estrellas mb-2">★★★★★</div>
                                <p className="text-muted small">FinLi me ayudó a organizar mis gastos y a ahorrar para mis metas. Interfaz clara y consejos útiles.</p>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="card border-0 card-shadow p-4 testimonial-card">
                                <div className="testimonial-header">
                                    <img src="/img/Usuarios/Usuario2.png" alt="Perfil" className="testimonial-img" />
                                    <div className="testimonial-info">
                                        <div className="testimonial-name">Martín Vizcarra</div>
                                        <p className="testimonial-date">Hace 20 min.</p>
                                    </div>
                                </div>
                                <div className="estrellas mb-2">★★★★★</div>
                                <p className="text-muted small">Las funciones de presupuesto me permitieron distribuir mejor mi dinero y reducir gastos innecesarios.</p>
                            </div>
                        </div>
                    </div>
                </div>
            
                {/* Slide 2 */}
                <div className="carousel-item">
                    <div className="row g-4">
                        <div className="col-md-6">
                            <div className="card border-0 card-shadow p-4 testimonial-card">
                                <div className="testimonial-header">
                                    <img src="/img/Usuarios/Usuario3.png" alt="Perfil" className="testimonial-img" />
                                    <div className="testimonial-info">
                                        <div className="testimonial-name">López Aliaga</div>
                                        <p className="testimonial-date">Hace 3 días</p>
                                    </div>
                                </div>
                                <div className="estrellas mb-2">★★★★★</div>
                                <p className="text-muted small">Gracias a FinLi pude ahorrar para mis estudios y entender mejor mis finanzas personales. ¡Totalmente recomendado!</p>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="card border-0 card-shadow p-4 testimonial-card">
                                <div className="testimonial-header">
                                    <img src="/img/Usuarios/Usuario4.png" alt="Perfil" className="testimonial-img" />
                                    <div className="testimonial-info">
                                        <div className="testimonial-name">Paolo Guerrero</div>
                                        <p className="testimonial-date">Hace 5 días</p>
                                    </div>
                                </div>
                                <div className="estrellas mb-2">★★★★☆</div>
                                <p className="text-muted small">Muy buena aplicación, me ha ayudado a controlar mis gastos. Solo mejoraría los recordatorios de pago.</p>
                            </div>
                        </div>
                    </div>
                </div>
            
                {/* Slide 3 */}
                <div className="carousel-item">
                    <div className="row g-4">
                        <div className="col-md-6">
                            <div className="card border-0 card-shadow p-4 testimonial-card">
                                <div className="testimonial-header">
                                    <img src="/img/Usuarios/Usuario5.png" alt="Perfil" className="testimonial-img" />
                                    <div className="testimonial-info">
                                        <div className="testimonial-name">Lamine Yamal</div>
                                        <p className="testimonial-date">Hace 1 semana</p>
                                    </div>
                                </div>
                                <div className="estrellas mb-2">★★★★★</div>
                                <p className="text-muted small">Los reportes visuales son excelentes, me permiten entender rápidamente en qué gasto mi dinero cada mes.</p>
                            </div>
                        </div>
                            <div className="col-md-6">
                                    <div className="card border-0 card-shadow p-4 testimonial-card">
                                        <div className="testimonial-header">
                                            <img src="/img/Usuarios/Usuario6.png" alt="Perfil" className="testimonial-img" />
                                            <div className="testimonial-info">
                                                <div className="testimonial-name">Lionel Messi</div>
                                                <p className="testimonial-date">Hace 2 semanas</p>
                                            </div>
                                        </div>
                                        <div className="estrellas mb-2">★★★★☆</div>
                                        <p className="text-muted small">FinLi transformó mi manera de manejar el dinero. Ahora tengo un mejor control y he logrado ahorrar consientemente.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                    </div>
        
                    {/* Controles del carrusel */}
                    <button className="carousel-control-prev" type="button" data-bs-target="#testimonialCarousel" data-bs-slide="prev">
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Anterior</span>
                    </button>
                    <button className="carousel-control-next" type="button" data-bs-target="#testimonialCarousel" data-bs-slide="next">
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Siguiente</span>
                    </button>
                    
                    <div className="carousel-indicators position-relative mt-4">
                        <button type="button" data-bs-target="#testimonialCarousel" data-bs-slide-to="0" className="active testimonial-dot" aria-current="true"></button>
                        <button type="button" data-bs-target="#testimonialCarousel" data-bs-slide-to="1" className="testimonial-dot"></button>
                        <button type="button" data-bs-target="#testimonialCarousel" data-bs-slide-to="2" className="testimonial-dot"></button>
                    </div>
                </div>
            </section>
            
            {/* Ponte en contacto con nosotros (Formulario) */}
            <section className="p-5 bg-plomo mt-5">
                <div className="row g-4">
                    <div className="col-md-4 d-flex flex-column justify-content-center text-center">
                        <h5 className="fw-semibold">Ponte en contacto con nosotros</h5>
                        <p className="text-muted">Si tienes alguna duda, necesitas ayuda o deseas más información, mándanos un mensaje. Estamos aquí para ayudarte a tomar el control.</p>
                    </div>
                    <div className="col-md-8">
                        <form className="p-4" onSubmit={handleSubmit}> 
                            <div className="mb-3">
                                <label htmlFor="nombre" className="form-label">Nombre:</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    id="nombre" 
                                    placeholder="Ejm. Rafael Lopez Aliaga" 
                                    required
                                    value={formData.nombre} 
                                    onChange={handleChange} 
                                /> 
                            </div>
                            <div className="mb-3">
                                <label htmlFor="correo" className="form-label">Correo Electrónico:</label>
                                <input 
                                    type="email" 
                                    className="form-control" 
                                    id="correo" 
                                    placeholder="Ejm. utepino@gmail.com" 
                                    required
                                    value={formData.correo} 
                                    onChange={handleChange} 
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="mensaje" className="form-label">Mensaje:</label>
                                <textarea 
                                    className="form-control" 
                                    id="mensaje" 
                                    rows="5" 
                                    placeholder="Escriba su duda..."
                                    required
                                    value={formData.mensaje} 
                                    onChange={handleChange}
                                ></textarea>
                            </div>
                            <button type="submit" className="btn btn-custom">Enviar</button>
                        </form>
                    </div>
                </div>
            </section>
        </main>
        </>
    );

}

export default Inicio;
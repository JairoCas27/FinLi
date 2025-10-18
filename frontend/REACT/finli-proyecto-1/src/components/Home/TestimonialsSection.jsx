// src/components/Home/TestimonialsSection.jsx

const testimonials = [
    [
        { name: "Dina Boluarte", date: "Hace 5 mim", rating: "★★★★★", text: "FinLi me ayudó a organizar mis gastos y a ahorrar para mis metas. Interfaz clara y consejos útiles.", imgSrc: "/img/Usuarios/Usuario1.png" },
        { name: "Martín Vizcarra", date: "Hace 20 min.", rating: "★★★★★", text: "Las funciones de presupuesto me permitieron distribuir mejor mi dinero y reducir gastos innecesarios.", imgSrc: "/img/Usuarios/Usuario2.png" },
    ],
    [
        { name: "López Aliaga", date: "Hace 3 días", rating: "★★★★★", text: "Gracias a FinLi pude ahorrar para mis estudios y entender mejor mis finanzas personales. ¡Totalmente recomendado!", imgSrc: "/img/Usuarios/Usuario3.png" },
        { name: "Paolo Guerrero", date: "Hace 5 días", rating: "★★★★☆", text: "Muy buena aplicación, me ha ayudado a controlar mis gastos. Solo mejoraría los recordatorios de pago.", imgSrc: "/img/Usuarios/Usuario4.png" },
    ],
    [
        { name: "Lamine Yamal", date: "Hace 1 semana", rating: "★★★★★", text: "Los reportes visuales son excelentes, me permiten entender rápidamente en qué gasto mi dinero cada mes.", imgSrc: "/img/Usuarios/Usuario5.png" },
        { name: "Lionel Messi", date: "Hace 2 semanas", rating: "★★★★☆", text: "FinLi transformó mi manera de manejar el dinero. Ahora tengo un mejor control y he logrado ahorrar consientemente.", imgSrc: "/img/Usuarios/Usuario6.png" },
    ]
];

const TestimonialCard = ({ name, date, rating, text, imgSrc }) => (
    <div className="col-md-6">
        <div className="card border-0 card-shadow p-4 testimonial-card">
            <div className="testimonial-header">
                <img src={imgSrc} alt="Perfil" className="testimonial-img" />
                <div className="testimonial-info">
                    <div className="testimonial-name">{name}</div>
                    <p className="testimonial-date">{date}</p>
                </div>
            </div>
            <div className="estrellas mb-2">{rating}</div>
            <p className="text-muted small">{text}</p>
        </div>
    </div>
);


function TestimonialsSection() {
    return (
        <section className="p-4 bg-mint mt-4">
            
                <div className="text-center my-4">
                    <h4 className="fw-semibold">Lo que nuestros usuarios dicen de FinLi...</h4>
                    <p className="text-muted">Descubre cómo FinLi está ayudando a cientos de jóvenes a transformar su relación con el dinero.</p>
                </div>

                <div id="testimonialCarousel" className="carousel slide testimonial-carousel" data-bs-ride="carousel">
                    <div className="carousel-inner">
                        {testimonials.map((slide, slideIndex) => (
                            <div
                                key={slideIndex}
                                className={`carousel-item ${slideIndex === 0 ? 'active' : ''}`}
                            >
                                <div className="row g-4">
                                    {slide.map((testimonial, cardIndex) => (
                                        <TestimonialCard
                                            key={cardIndex}
                                            name={testimonial.name}
                                            date={testimonial.date}
                                            rating={testimonial.rating}
                                            text={testimonial.text}
                                            imgSrc={testimonial.imgSrc}
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
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

                    {/* Indicadores */}
                    <div className="carousel-indicators position-relative mt-4">
                        {testimonials.map((_, index) => (
                            <button
                                key={index}
                                type="button"
                                data-bs-target="#testimonialCarousel"
                                data-bs-slide-to={index}
                                className={`${index === 0 ? 'active' : ''} testimonial-dot`}
                                aria-current={index === 0 ? 'true' : 'false'}
                            />
                        ))}
                    </div>
                </div>
            
        </section>
    );
}

export default TestimonialsSection;
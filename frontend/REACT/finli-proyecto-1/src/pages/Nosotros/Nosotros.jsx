// src/pages/Nosotros/Nosotros.jsx

import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import BubblesBackground from '../../components/Bubbles/BubblesBackground'; 
import './Nosotros.css'; 

function Nosotros() {
    return (
        <main>
            <BubblesBackground /> 
            <section className="historia-hero">
                <Container>
                    <Row className="align-items-center justify-content-center">
                        <Col lg={6} className="mb-4 mb-lg-0">
                            <div className="historia-img card-shadow">
                                <img src="./img/Contenido/nosotros.png" alt="Equipo FinLi trabajando" loading="lazy" className="w-100 h-100" />
                            </div>
                        </Col>
                        <Col lg={6}>
                            <h1 className="nosotros-title">Nuestra Historia</h1>
                            <p className="nosotros-subtitle">
                                FinLi nació de la frustración de ver a muchos jóvenes como nosotros sentirse abrumados y sin herramientas claras para manejar su dinero. Queríamos crear una solución que fuera a la vez intuitiva y poderosa, que realmente empoderara a la gente a tomar el control de su futuro financiero.
                            </p>
                        </Col>
                    </Row>
                </Container>
            </section>

            <section className="nosotros-hero text-center">
                <Container>
                    <Row className="justify-content-center">
                        <Col lg={10}>
                            <h1 className="nosotros-title">Nuestra Misión</h1>
                            <p className="nosotros-subtitle">Descubre cómo FinLi está ayudando a cientos de jóvenes a transformar su relación con el dinero.</p>

                            <div className="valores-container">
                                <div className="valor-item">
                                    <div className="valor-icon">
                                        <i className="bi bi-cash-stack"></i>
                                    </div>
                                    <p>Empoderar a nuestros usuarios para que tomen el control de sus finanzas personales con confianza.</p>
                                </div>

                                <div className="valor-item">
                                    <div className="valor-icon">
                                        <i className="bi bi-piggy-bank"></i>
                                    </div>
                                    <p>Simplificar la gestión del dinero, transformando una tarea compleja en un hábito diario, simple e inteligente.</p>
                                </div>

                                <div className="valor-item">
                                    <div className="valor-icon">
                                        <i className="bi bi-people"></i>
                                    </div>
                                    <p>Democratizar el bienestar financiero, haciendo que las herramientas de planificación y ahorro sean accesibles para todos.</p>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>

            <section className="mision-vision-section">
                <Container>
                    <Row className="justify-content-center">
                        <Col lg={10}>
                            <div className="mision-vision-card">
                                <h2 className="mision-vision-title">Nuestra Visión</h2>
                                <p className="mision-vision-content">
                                    Ser la plataforma líder en tecnología financiera en Latinoamérica, reconocida por empoderar a millones de personas a alcanzar sus metas y tranquilidad financiera, transformando la percepción de las finanzas personales de una tarea compleja en un hábito diario y gratificante.
                                </p>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>
        </main>
    );
}

export default Nosotros;
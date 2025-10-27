import React from 'react';
import { Container, Row, Col } from 'react-bootstrap'; 
import BubblesBackground from '../../components/Bubbles/BubblesBackground'; 
import './Servicios.css'; 

function Servicios() {
    return (
        <>
            <BubblesBackground />
            <section className="hero-servicios">
                <Container>
                    <Row className="align-items-center">
                        <Col lg={8} className="mx-auto text-center">
                            <h1 className="h1 fw-bold mb-4">Tus metas financieras, hechas realidad.</h1>
                            <p className="lead mb-5">Descubre todas las herramientas de FinLi diseñadas para que tomes el control de tu dinero de forma inteligente.</p>
                             <h2 className="mb-4">¿Listo para tomar el control de tus finanzas?</h2>
                            <p className="lead mb-4">Comienza hoy mismo a transformar tu relación con el dinero</p>
                            <a href="/frontend/src/pages/Autenticación/login.html" className="btn btn-custom btn-lg">Comenzar Ahora</a>
                       </Col>
                    </Row>
                </Container>
            </section>

            <section id="services" className="service-section">
                <Container>
                    <div id="gestion" className="row align-items-center mb-4">
                        <Col lg={5}>
                            <div className="service-card">
                                <div className="service-icon">
                                    <i className="bi bi-cash-coin"></i>
                                </div>
                                <h2>Gestión de Ingresos y Gastos</h2>
                                <div className="divider"></div> 
                                <p className="mb-4">Registra y categoriza tus ingresos y gastos. Con nuestra aplicación digital y web, puedes capturar cada uno de tus movimientos financieros en segundos. Clasifica tus gastos necesarios para reconocer tus patrones de consumo.</p>
                                <p className="fst-italic">"Tu dinero, bajo control y explicado para que tomes decisiones informadas. Tu historia financiera siempre organizada y el dinero de tu bolsillo mejor gestionado."</p>
                            </div>
                        </Col>
                        <Col lg={5}>
                            <img src="./img/Contenido/gestion.png" alt="Gestión de Ingresos y Gastos" className="img-fluid" />
                        </Col>
                    </div>

                    <div id="analisis" className="row align-items-center mb-4 flex-lg-row-reverse">
                        <Col lg={5}>
                            <div className="service-card">
                                <div className="service-icon">
                                    <i className="bi bi-bar-chart-line"></i>
                                </div>
                                <h2>Análisis y Reportes Visuales</h2>
                                <div className="divider"></div>
                                <p className="mb-4">Descubre los patrones detrás de tus hábitos de gasto. FinLi transforma tus datos en gráficos y reportes visuales que te muestran exactamente en qué gastas tu dinero.</p>
                                <p className="mb-4">Visualiza la distribución de gastos con diagramas claros, compara tus ingresos y gastos con gráficas de tendencias y observa la evolución de tu balance a lo largo del tiempo.</p>
                                <p>Con esta información, puedes tomar decisiones informadas para optimizar tus finanzas.</p>
                            </div>
                        </Col>
                        <Col lg={5}>
                            <img src="./img/Contenido/reporte.png" alt="Análisis y Reportes Visuales" className="img-fluid" />
                        </Col>
                    </div>

                    <div id="pagos" className="row align-items-center">
                        <Col lg={5}>
                            <div className="service-card">
                                <div className="service-icon">
                                    <i className="bi bi-wallet2"></i>
                                </div>
                                <h2>Pagos y Presupuestos Inteligentes</h2>
                                <div className="divider"></div>
                                <p className="mb-4">Toma el control y aprovecha al máximo tu economía. Configura alertas para gastos inusuales o recurrentes, y recibe notificaciones de pagos próximos.</p>
                                <p className="mb-4">Además, crea presupuestos personalizados para mantener un equilibrio y asegurarte de que no excedes tus límites.</p>
                                <p>Con todo esto, podrás planificar tu futuro financiero sin estrés.</p>
                            </div>
                        </Col>
                        <Col lg={5}>
                            <img src="https://img.freepik.com/vector-premium/ilustracion-vectorial-sobre-concepto-o-agenda-fecha-pago-dinero-calendario_675567-10354.jpg" alt="Pagos y Presupuestos Inteligentes" className="img-fluid" />
                        </Col>
                    </div>
                </Container>
            </section>

            <section className="py-5">
                <Container>
                    <Row>
                        <Col lg={8} className="mx-auto text-center">
                            <h2 className="mb-4">¿Listo para tomar el control de tus finanzas?</h2>
                            <p className="lead mb-4">Comienza hoy mismo a transformar tu relación con el dinero</p>
                            <a href="/frontend/src/pages/Autenticación/login.html" className="btn btn-custom btn-lg">Comenzar Ahora</a>
                        </Col> 
                    </Row>
                </Container>
            </section>
        </>
    );
}

export default Servicios;
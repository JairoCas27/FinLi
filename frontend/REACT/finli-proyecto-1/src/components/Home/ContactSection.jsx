// src/components/Home/ContactSection.jsx

import React, { useState } from 'react';
import { Spinner } from 'react-bootstrap'; 

function ContactSection() {
    const [formData, setFormData] = useState({
        nombre: '',
        correo: '',
        mensaje: '',
    });

    const [status, setStatus] = useState({ show: false, message: '', type: '' });

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [id]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        setStatus({ show: true, message: 'Enviando mensaje...', type: 'loading' });

        setTimeout(() => {
            setFormData({
                nombre: '',
                correo: '',
                mensaje: '',
            });

            setStatus({ 
                show: true, 
                message: '¡Mensaje enviado con éxito! Nos pondremos en contacto pronto.', 
                type: 'success' 
            });

            setTimeout(() => setStatus({ show: false, message: '', type: '' }), 5000); 

        }, 1500); 
    };

    const getAlertClasses = () => {
        if (!status.show) return '';
        switch (status.type) {
            case 'success':
                return 'alert-success';
            case 'loading':
                return 'alert-info';
            default:
                return 'alert-danger'; 
        }
    };
    
    return (
        <section className="p-5 bg-plomo mt-5">
            <div className="container">
                <div className="row g-4">
                    <div className="col-md-4 d-flex flex-column justify-content-center text-center">
                        <h5 className="fw-semibold">Ponte en contacto con nosotros</h5>
                        <p className="text-muted">
                            Si tienes alguna duda, necesitas ayuda o deseas más información, mándanos un mensaje.
                            Estamos aquí para ayudarte a tomar el control.
                        </p>
                    </div>
                    <div className="col-md-8">
                        <form className="p-4" onSubmit={handleSubmit}>
                            
                            {status.show && (
                                <div className={`alert ${getAlertClasses()} mb-3`} role="alert">
                                    <div className="d-flex align-items-center justify-content-center">
                                        {status.type === 'loading' && <Spinner animation="border" size="sm" className="me-2" />}
                                        {status.message}
                                    </div>
                                </div>
                            )}
                            <div className="mb-3">
                                <label htmlFor="nombre" className="form-label">Nombre:</label>
                                <input type="text" className="form-control" id="nombre" placeholder="Ejm. Rafael Lopez Aliaga" value={formData.nombre} onChange={handleChange} required />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="correo" className="form-label">Correo Electrónico:</label>
                                <input type="email" className="form-control" id="correo" placeholder="Ejm. utepino@gmail.com" value={formData.correo} onChange={handleChange} required />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="mensaje" className="form-label">Mensaje:</label>
                                <textarea className="form-control" id="mensaje" rows="5" placeholder="Escriba su duda..." value={formData.mensaje} onChange={handleChange} required></textarea>
                            </div>
                            <button type="submit" className="btn btn-custom" disabled={status.type === 'loading'}>
                                {status.type === 'loading' ? 'Enviando...' : 'Enviar'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default ContactSection;

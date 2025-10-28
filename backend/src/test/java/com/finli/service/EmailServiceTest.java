package com.finli.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class EmailServiceTest {

    @InjectMocks
    private EmailService emailService;

    @BeforeEach
    void setUp() {
        // Configurar para un servidor SMTP local que no existe
        // Esto hará que falle rápido sin intentar autenticación real
        ReflectionTestUtils.setField(emailService, "host", "localhost");
        ReflectionTestUtils.setField(emailService, "port", 587);
        ReflectionTestUtils.setField(emailService, "username", "test");
        ReflectionTestUtils.setField(emailService, "password", "test");
        ReflectionTestUtils.setField(emailService, "startTlsEnable", false);
        ReflectionTestUtils.setField(emailService, "auth", false);
    }

    @Test
    void sendEmail_ConfiguracionInvalida_LanzaExcepcionControlada() {
        // Este test espera que falle la conexión SMTP pero que maneje la excepción
        // según la lógica de tu servicio

        Exception exception = assertThrows(RuntimeException.class, () ->
                emailService.sendEmail("test@example.com", "Test Subject", "Test Message")
        );

        assertTrue(exception.getMessage().contains("Fallo al enviar el correo"));
    }
}
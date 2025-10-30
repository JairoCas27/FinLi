package com.finli.model;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.assertEquals;
import org.junit.jupiter.api.Test;

class MedioPagoTest {

    @Test
    void medioPago_Builder_Success() {
        // Arrange
        LocalDateTime fechaCreacion = LocalDateTime.now();
        Usuario usuario = Usuario.builder().id(1).build();

        // Act
        MedioPago medioPago = MedioPago.builder()
            .idMedioPago(1)
            .nombreMedioPago("Tarjeta de Crédito")
            .montoInicial(1000.0)
            .fechaCreacion(fechaCreacion)
            .usuario(usuario)
            .build();

        // Assert
        assertEquals(1, medioPago.getIdMedioPago());
        assertEquals("Tarjeta de Crédito", medioPago.getNombreMedioPago());
        assertEquals(1000.0, medioPago.getMontoInicial());
        assertEquals(fechaCreacion, medioPago.getFechaCreacion());
        assertEquals(usuario, medioPago.getUsuario());
    }
}
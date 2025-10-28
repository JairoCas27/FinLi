package com.finli.dto;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class TransaccionRequestTest {

    @Test
    void validar_EmailVacio_LanzaExcepcion() {
        TransaccionRequest request = TransaccionRequest.builder()
                .nombreTransaccion("Test")
                .tipo("ingreso")
                .monto(100.0)
                .fecha("2024-01-01T10:00:00")
                .email("") // EMAIL VACÍO - esto debería lanzar excepción
                .idMedioPago(1)
                .idCategoria(1)
                .idSubcategoria(1)
                .build();

        Exception exception = assertThrows(IllegalArgumentException.class, request::validar);
        assertTrue(exception.getMessage().contains("Email requerido"));
    }
}
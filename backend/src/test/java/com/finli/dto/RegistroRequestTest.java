package com.finli.dto;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class RegistroRequestTest {

    @Test
    void builder_CreaInstanciaCorrectamente() {
        RegistroRequest request = RegistroRequest.builder()
                .nombre("María")
                .apellidoPaterno("López")
                .apellidoMaterno("García")
                .edad(25)
                .email("maria@test.com")
                .contrasena("password123")
                .confirmarContrasena("password123")
                .build();

        assertAll(
                () -> assertEquals("María", request.getNombre()),
                () -> assertEquals("López", request.getApellidoPaterno()),
                () -> assertEquals("García", request.getApellidoMaterno()),
                () -> assertEquals(25, request.getEdad()),
                () -> assertEquals("maria@test.com", request.getEmail()),
                () -> assertEquals("password123", request.getContrasena()),
                () -> assertEquals("password123", request.getConfirmarContrasena())
        );
    }

    @Test
    void dataAnnotations_FuncionanCorrectamente() {
        RegistroRequest request = new RegistroRequest();
        request.setNombre("Test");
        request.setEmail("test@test.com");

        assertEquals("Test", request.getNombre());
        assertEquals("test@test.com", request.getEmail());
        assertNotNull(request.toString());
    }
}
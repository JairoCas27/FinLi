package com.finli.dto;

import static org.junit.jupiter.api.Assertions.assertEquals;
import org.junit.jupiter.api.Test;

class UsuarioResponseTest {

    @Test
    void usuarioResponse_ConstructorAndGetters_Success() {
        // Arrange
        UsuarioResponse.EstadoUsuarioResponse estado = 
            new UsuarioResponse.EstadoUsuarioResponse(1, "Activo");

        // Act
        UsuarioResponse response = UsuarioResponse.builder()
            .id(1)
            .correo("test@test.com")
            .nombre("Test")
            .apellidoPaterno("Paterno")
            .apellidoMaterno("Materno")
            .edad(30)
            .fechaRegistro("2024-01-01")
            .estadoUsuario(estado)
            .build();

        // Assert
        assertEquals(1, response.getId());
        assertEquals("test@test.com", response.getCorreo());
        assertEquals("Test", response.getNombre());
        assertEquals("Paterno", response.getApellidoPaterno());
        assertEquals("Materno", response.getApellidoMaterno());
        assertEquals(30, response.getEdad());
        assertEquals("2024-01-01", response.getFechaRegistro());
        assertEquals(1, response.getEstadoUsuario().getIdEstado());
        assertEquals("Activo", response.getEstadoUsuario().getNombreEstado());
    }

    @Test
    void estadoUsuarioResponse_ConstructorAndGetters_Success() {
        // Arrange & Act
        UsuarioResponse.EstadoUsuarioResponse estado = 
            new UsuarioResponse.EstadoUsuarioResponse(1, "Activo");

        // Assert
        assertEquals(1, estado.getIdEstado());
        assertEquals("Activo", estado.getNombreEstado());
    }

    @Test
    void estadoUsuarioResponse_Builder_Success() {
        // Arrange & Act
        UsuarioResponse.EstadoUsuarioResponse estado = 
            UsuarioResponse.EstadoUsuarioResponse.builder()
                .idEstado(2)
                .nombreEstado("Inactivo")
                .build();

        // Assert
        assertEquals(2, estado.getIdEstado());
        assertEquals("Inactivo", estado.getNombreEstado());
    }

    @Test
    void usuarioResponse_EqualsAndHashCode_Success() {
        // Arrange
        UsuarioResponse.EstadoUsuarioResponse estado = 
            new UsuarioResponse.EstadoUsuarioResponse(1, "Activo");
        
        UsuarioResponse response1 = UsuarioResponse.builder()
            .id(1)
            .correo("test@test.com")
            .estadoUsuario(estado)
            .build();
            
        UsuarioResponse response2 = UsuarioResponse.builder()
            .id(1)
            .correo("test@test.com")
            .estadoUsuario(estado)
            .build();

        // Act & Assert
        assertEquals(response1, response2);
        assertEquals(response1.hashCode(), response2.hashCode());
    }
}
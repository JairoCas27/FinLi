package com.finli.model;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.Test;

class UsuarioTest {

    @Test
    void usuario_Builder_Success() {
        // Arrange
        EstadoUsuario estado = EstadoUsuario.builder()
            .idEstado(1)
            .nombreEstado("Activo")
            .build();

        // Act
        Usuario usuario = Usuario.builder()
            .id(1)
            .correo("test@test.com")
            .contrasena("password123")
            .nombre("Test")
            .apellidoPaterno("Paterno")
            .apellidoMaterno("Materno")
            .edad(30)
            .estadoUsuario(estado)
            .build();

        // Assert
        assertEquals(1, usuario.getId());
        assertEquals("test@test.com", usuario.getCorreo());
        assertEquals("password123", usuario.getContrasena());
        assertEquals("Test", usuario.getNombre());
        assertEquals("Paterno", usuario.getApellidoPaterno());
        assertEquals("Materno", usuario.getApellidoMaterno());
        assertEquals(30, usuario.getEdad());
        assertEquals(estado, usuario.getEstadoUsuario());
    }

    @Test
    void usuario_NoArgsConstructor_Success() {
        // Arrange & Act
        Usuario usuario = new Usuario();
        usuario.setId(1);
        usuario.setCorreo("test@test.com");

        // Assert
        assertEquals(1, usuario.getId());
        assertEquals("test@test.com", usuario.getCorreo());
    }

    @Test
    void usuario_AllArgsConstructor_Success() {
        // Arrange
        EstadoUsuario estado = EstadoUsuario.builder().idEstado(1).build();

        // Act
        Usuario usuario = new Usuario(1, "test@test.com", "pass", "Test", 
            "Paterno", "Materno", 30, estado);

        // Assert
        assertEquals(1, usuario.getId());
        assertEquals("test@test.com", usuario.getCorreo());
        assertEquals("Test", usuario.getNombre());
    }

    @Test
    void usuario_EqualsAndHashCode_Success() {
        // Arrange
        EstadoUsuario estado = EstadoUsuario.builder().idEstado(1).build();
        
        Usuario usuario1 = Usuario.builder()
            .id(1)
            .correo("test@test.com")
            .estadoUsuario(estado)
            .build();
            
        Usuario usuario2 = Usuario.builder()
            .id(1)
            .correo("test@test.com")
            .estadoUsuario(estado)
            .build();

        // Act & Assert
        assertEquals(usuario1, usuario2);
        assertEquals(usuario1.hashCode(), usuario2.hashCode());
    }

    @Test
    void usuario_ToString_Success() {
        // Arrange
        Usuario usuario = Usuario.builder()
            .id(1)
            .correo("test@test.com")
            .build();

        // Act & Assert
        assertNotNull(usuario.toString());
        assertTrue(usuario.toString().contains("test@test.com"));
    }
}
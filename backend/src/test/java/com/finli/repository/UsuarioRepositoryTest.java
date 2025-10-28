package com.finli.repository;

import com.finli.model.Usuario;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.jdbc.Sql;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@Sql(scripts = {"/schema.sql", "/data.sql"})
class UsuarioRepositoryTest {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Test
    void findByCorreo_UsuarioExiste_RetornaUsuario() {
        // Arrange - Crear usuario usando el repositorio directamente
        Usuario usuario = Usuario.builder()
                .correo("test@repository.com")
                .contrasena("password")
                .nombre("Test")
                .apellidoPaterno("Repo")
                .apellidoMaterno("Test")
                .edad(25)
                .build();

        // El estadoUsuario debería tener ID 1 (Activo) de data.sql
        usuarioRepository.save(usuario);

        // Act
        Optional<Usuario> found = usuarioRepository.findByCorreo("test@repository.com");

        // Assert
        assertTrue(found.isPresent());
        assertEquals("test@repository.com", found.get().getCorreo());
    }

    @Test
    void existsByCorreo_CorreoExiste_RetornaTrue() {
        // Arrange
        Usuario usuario = Usuario.builder()
                .correo("exist@test.com")
                .contrasena("password")
                .nombre("Exist")
                .apellidoPaterno("Test")
                .apellidoMaterno("User")
                .edad(30)
                .build();

        usuarioRepository.save(usuario);

        // Act
        boolean exists = usuarioRepository.existsByCorreo("exist@test.com");

        // Assert
        assertTrue(exists);
    }
}
package com.finli.repository;

import com.finli.model.PasswordResetToken;
import com.finli.model.Usuario;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.jdbc.Sql;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@Sql(scripts = {"/schema.sql", "/data.sql"})
class PasswordResetTokenRepositoryTest {

    @Autowired
    private PasswordResetTokenRepository passwordResetTokenRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Test
    void findByToken_TokenExiste_RetornaToken() {
        // Arrange - Crear usuario primero
        Usuario usuario = Usuario.builder()
                .correo("token@test.com")
                .contrasena("password")
                .nombre("Token")
                .apellidoPaterno("Test")
                .apellidoMaterno("User")
                .edad(28)
                .build();

        Usuario savedUsuario = usuarioRepository.save(usuario);

        PasswordResetToken token = PasswordResetToken.builder()
                .token("123456")
                .usuario(savedUsuario)
                .expiryDate(LocalDateTime.now().plusMinutes(10))
                .build();

        passwordResetTokenRepository.save(token);

        // Act
        Optional<PasswordResetToken> found = passwordResetTokenRepository.findByToken("123456");

        // Assert
        assertTrue(found.isPresent());
        assertEquals("123456", found.get().getToken());
        assertEquals("token@test.com", found.get().getUsuario().getCorreo());
    }
}
package com.finli.model;

import org.junit.jupiter.api.Test;
import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

class PasswordResetTokenTest {

    @Test
    void calculateExpiryDate_FechaExpiracionCorrecta() {
        // Arrange
        Usuario usuario = Usuario.builder().id(1).build();
        PasswordResetToken token = new PasswordResetToken("123456", usuario);

        // Act
        LocalDateTime expiryDate = token.getExpiryDate();
        LocalDateTime expectedDate = LocalDateTime.now().plusMinutes(10);

        // Assert - Verificar que la fecha de expiración es aproximadamente 10 minutos en el futuro
        assertTrue(expiryDate.isAfter(LocalDateTime.now()));
        assertTrue(expiryDate.isBefore(LocalDateTime.now().plusMinutes(11)));
    }

    @Test
    void builder_CreaInstanciaCorrectamente() {
        Usuario usuario = Usuario.builder().id(1).build();

        PasswordResetToken token = PasswordResetToken.builder()
                .token("654321")
                .usuario(usuario)
                .expiryDate(LocalDateTime.now().plusMinutes(10))
                .build();

        assertAll(
                () -> assertEquals("654321", token.getToken()),
                () -> assertEquals(usuario, token.getUsuario()),
                () -> assertNotNull(token.getExpiryDate())
        );
    }
}
package com.finli.dto;

import static org.junit.jupiter.api.Assertions.assertEquals;
import org.junit.jupiter.api.Test;

class PasswordResetRequestTest {

    @Test
    void passwordResetRequest_ConstructorAndGetters_Success() {
        // Arrange & Act
        PasswordResetRequest request = new PasswordResetRequest(
            "test@example.com", "123456", "newPassword123");

        // Assert
        assertEquals("test@example.com", request.getEmail());
        assertEquals("123456", request.getToken());
        assertEquals("newPassword123", request.getNuevaContrasena());
    }

    @Test
    void passwordResetRequest_NoArgsConstructor_Success() {
        // Arrange & Act
        PasswordResetRequest request = new PasswordResetRequest();
        request.setEmail("test@example.com");
        request.setToken("123456");
        request.setNuevaContrasena("newPassword123");

        // Assert
        assertEquals("test@example.com", request.getEmail());
        assertEquals("123456", request.getToken());
        assertEquals("newPassword123", request.getNuevaContrasena());
    }

    @Test
    void passwordResetRequest_EqualsAndHashCode_Success() {
        // Arrange
        PasswordResetRequest request1 = new PasswordResetRequest("test@example.com", "123456", "pass");
        PasswordResetRequest request2 = new PasswordResetRequest("test@example.com", "123456", "pass");

        // Act & Assert
        assertEquals(request1, request2);
        assertEquals(request1.hashCode(), request2.hashCode());
    }
}
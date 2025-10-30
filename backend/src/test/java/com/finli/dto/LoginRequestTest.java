package com.finli.dto;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.Test;

class LoginRequestTest {

    @Test
    void loginRequest_ConstructorAndGetters_Success() {
        // Arrange & Act
        LoginRequest request = new LoginRequest("test@example.com", "password123");

        // Assert
        assertEquals("test@example.com", request.getEmail());
        assertEquals("password123", request.getContrasena());
    }

    @Test
    void loginRequest_NoArgsConstructor_Success() {
        // Arrange & Act
        LoginRequest request = new LoginRequest();
        request.setEmail("test@example.com");
        request.setContrasena("password123");

        // Assert
        assertEquals("test@example.com", request.getEmail());
        assertEquals("password123", request.getContrasena());
    }

    @Test
    void loginRequest_DataAnnotations_Success() {
        // Arrange & Act
        LoginRequest request = new LoginRequest("test@example.com", "password123");

        // Assert
        assertNotNull(request.toString());
        assertTrue(request.toString().contains("test@example.com"));
    }
}
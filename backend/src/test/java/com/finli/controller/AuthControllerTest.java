package com.finli.controller;

import com.finli.dto.LoginRequest;
import com.finli.dto.RegistroRequest;
import com.finli.dto.UsuarioResponse;
import com.finli.model.Usuario;
import com.finli.service.ServicioAutenticacion;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthControllerTest {

    @Mock
    private ServicioAutenticacion servicio;

    @InjectMocks
    private AuthController authController;

    @Test
    void login_CredencialesValidas_RetornaOk() {
        // Arrange
        LoginRequest request = new LoginRequest("test@example.com", "password123");
        Usuario usuario = Usuario.builder().id(1).correo("test@example.com").build();
        UsuarioResponse usuarioResponse = UsuarioResponse.builder()
                .id(1)
                .correo("test@example.com")
                .build();

        when(servicio.login("test@example.com", "password123")).thenReturn(usuario);
        when(servicio.toResponse(usuario)).thenReturn(usuarioResponse); // CORREGIDO: Devuelve UsuarioResponse

        // Act
        ResponseEntity<?> response = authController.login(request);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(usuarioResponse, response.getBody());
    }

    @Test
    void register_UsuarioValido_RetornaCreado() {
        // Arrange
        RegistroRequest request = RegistroRequest.builder()
                .nombre("Test")
                .email("nuevo@test.com")
                .contrasena("pass123")
                .confirmarContrasena("pass123")
                .build();

        Usuario usuario = Usuario.builder().id(1).build();
        when(servicio.registrar(any(RegistroRequest.class))).thenReturn(usuario);

        // Act
        ResponseEntity<?> response = authController.register(request);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertTrue(response.getBody().toString().contains("Usuario creado ID: 1"));
    }
}
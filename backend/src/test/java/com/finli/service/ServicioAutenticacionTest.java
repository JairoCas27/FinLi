package com.finli.service;

import com.finli.dto.RegistroRequest;
import com.finli.dto.UsuarioResponse;
import com.finli.model.EstadoUsuario;
import com.finli.model.Usuario;
import com.finli.repository.EstadoUsuarioRepository;
import com.finli.repository.UsuarioRepository;
import com.finli.repository.PasswordResetTokenRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mindrot.jbcrypt.BCrypt;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ServicioAutenticacionTest {

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private EstadoUsuarioRepository estadoUsuarioRepository;

    @Mock
    private PasswordResetTokenRepository passwordResetTokenRepository;

    @Mock
    private EmailService emailService;

    @InjectMocks
    private ServicioAutenticacion servicioAutenticacion;

    @Test
    void toResponse_UsuarioValido_RetornaUsuarioResponse() {
        // Arrange
        Usuario usuario = Usuario.builder()
                .id(1)
                .correo("test@example.com")
                .nombre("Juan")
                .apellidoPaterno("Pérez")
                .apellidoMaterno("Gómez")
                .edad(30)
                .build();

        // Act
        UsuarioResponse response = servicioAutenticacion.toResponse(usuario);

        // Assert
        assertNotNull(response);
        assertEquals(1, response.getId());
        assertEquals("test@example.com", response.getCorreo());
        assertEquals("Juan", response.getNombre());
    }

    @Test
    void buscarPorCorreo_UsuarioExiste_RetornaUsuario() {
        // Arrange
        String email = "test@example.com";
        Usuario usuario = Usuario.builder()
                .id(1)
                .correo(email)
                .build();

        when(usuarioRepository.findByCorreo(email)).thenReturn(Optional.of(usuario));

        // Act
        Optional<Usuario> resultado = servicioAutenticacion.buscarPorCorreo(email);

        // Assert
        assertTrue(resultado.isPresent());
        assertEquals(email, resultado.get().getCorreo());
    }

    @Test
    void registrar_DatosValidos_UsuarioCreado() {
        // Arrange
        RegistroRequest request = RegistroRequest.builder()
                .nombre("Juan")
                .apellidoPaterno("Pérez")
                .apellidoMaterno("Gómez")
                .edad(30)
                .email("nuevo@example.com")
                .contrasena("password123")
                .confirmarContrasena("password123")
                .build();

        EstadoUsuario estadoActivo = EstadoUsuario.builder()
                .idEstado(1)
                .nombreEstado("Activo")
                .build();

        when(usuarioRepository.existsByCorreo("nuevo@example.com")).thenReturn(false);
        when(estadoUsuarioRepository.findById(1)).thenReturn(Optional.of(estadoActivo));
        when(usuarioRepository.save(any(Usuario.class))).thenAnswer(invocation -> {
            Usuario usuarioGuardado = invocation.getArgument(0);
            usuarioGuardado.setId(1);
            return usuarioGuardado;
        });

        // Act
        Usuario resultado = servicioAutenticacion.registrar(request);

        // Assert
        assertNotNull(resultado);
        assertEquals("nuevo@example.com", resultado.getCorreo());
        verify(usuarioRepository).save(any(Usuario.class));
    }
}
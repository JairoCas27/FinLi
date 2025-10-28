package com.finli.service;

import com.finli.dto.PaginacionUsuarioResponse;
import com.finli.dto.UsuarioResponse;
import com.finli.model.EstadoUsuario;
import com.finli.model.Usuario;
import com.finli.repository.EstadoUsuarioRepository;
import com.finli.repository.UsuarioRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.*;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AdministradorServiceTest {

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private ServicioAutenticacion servicioAutenticacion;

    @Mock
    private EstadoUsuarioRepository estadoUsuarioRepository;

    @InjectMocks
    private AdministradorService administradorService;

    private Usuario usuario;
    private EstadoUsuario estadoActivo;
    private EstadoUsuario estadoInactivo;

    @BeforeEach
    void setUp() {
        estadoActivo = EstadoUsuario.builder().idEstado(1).nombreEstado("Activo").build();
        estadoInactivo = EstadoUsuario.builder().idEstado(2).nombreEstado("Inactivo").build();

        usuario = Usuario.builder()
                .id(1)
                .correo("admin@test.com")
                .contrasena("encrypted")
                .nombre("Admin")
                .apellidoPaterno("Test")
                .apellidoMaterno("User")
                .edad(35)
                .estadoUsuario(estadoActivo)
                .build();
    }

    @Test
    void getUsuariosPaginadosYFiltrados_FiltroAll_RetornaTodosUsuarios() {
        // Arrange
        Pageable pageable = PageRequest.of(0, 10, Sort.by(Sort.Direction.DESC, "id"));
        Page<Usuario> page = new PageImpl<>(Arrays.asList(usuario), pageable, 1);

        when(usuarioRepository.findAll(pageable)).thenReturn(page);
        when(servicioAutenticacion.toResponse(usuario)).thenReturn(new UsuarioResponse());

        // Act
        PaginacionUsuarioResponse response = administradorService.getUsuariosPaginadosYFiltrados(1, 10, "all");

        // Assert
        assertNotNull(response);
        assertEquals(1, response.getTotalCount());
        verify(usuarioRepository).findAll(pageable);
    }

    @Test
    void eliminarUsuarioLogico_UsuarioExiste_DesactivaUsuario() {
        when(usuarioRepository.findById(1)).thenReturn(Optional.of(usuario));
        when(usuarioRepository.save(any(Usuario.class))).thenReturn(usuario);

        boolean resultado = administradorService.eliminarUsuarioLogico(1);

        assertTrue(resultado);
        verify(usuarioRepository).save(usuario);
    }

    @Test
    void actualizarUsuario_UsuarioExiste_ActualizaDatos() {
        Usuario usuarioActualizado = Usuario.builder()
                .id(1)
                .nombre("NuevoNombre")
                .apellidoPaterno("NuevoApellido")
                .correo("nuevo@test.com")
                .edad(40)
                .estadoUsuario(estadoActivo)
                .build();

        when(usuarioRepository.findById(1)).thenReturn(Optional.of(usuario));
        when(usuarioRepository.save(any(Usuario.class))).thenReturn(usuarioActualizado);

        Optional<Usuario> resultado = administradorService.actualizarUsuario(usuarioActualizado);

        assertTrue(resultado.isPresent());
        assertEquals("NuevoNombre", resultado.get().getNombre());
    }
}
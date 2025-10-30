package com.finli.controller;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.finli.dto.PaginacionUsuarioResponse;
import com.finli.model.EstadoUsuario;
import com.finli.model.Usuario;
import com.finli.service.AdministradorService;
import com.finli.service.ExcelExportService;

@ExtendWith(MockitoExtension.class)
class AdminControllerTest {

    @Mock
    private AdministradorService administradorService;

    @Mock
    private ExcelExportService excelExportService;

    @InjectMocks
    private AdminController adminController;

    @Test
    void getUsuariosPaginadosYFiltrados_ParametrosValidos_RetornaOk() {
        // Arrange
        PaginacionUsuarioResponse expectedResponse = new PaginacionUsuarioResponse();
        when(administradorService.getUsuariosPaginadosYFiltrados(1, 10, "all"))
                .thenReturn(expectedResponse);

        // Act
        ResponseEntity<PaginacionUsuarioResponse> response = 
                adminController.getUsuariosPaginadosYFiltrados(1, 10, "all");

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(expectedResponse, response.getBody());
    }

    @Test
    void crearCliente_UsuarioValido_RetornaCreado() {
        // Arrange
        Usuario usuario = Usuario.builder().id(1).correo("test@test.com").build();
        when(administradorService.guardarCliente(any(Usuario.class))).thenReturn(usuario);

        // Act
        ResponseEntity<Usuario> response = adminController.crearCliente(usuario);

        // Assert
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals(usuario, response.getBody());
    }

    @Test
    void actualizarUsuario_UsuarioExistente_RetornaOk() {
        // Arrange
        Usuario usuario = Usuario.builder().id(1).correo("test@test.com").build();
        when(administradorService.actualizarUsuario(any(Usuario.class)))
                .thenReturn(Optional.of(usuario));

        // Act
        ResponseEntity<Usuario> response = adminController.actualizarUsuario(1, usuario);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(usuario, response.getBody());
    }

    @Test
    void actualizarUsuario_UsuarioNoExistente_RetornaNotFound() {
        // Arrange
        Usuario usuario = Usuario.builder().id(999).build();
        when(administradorService.actualizarUsuario(any(Usuario.class)))
                .thenReturn(Optional.empty());

        // Act
        ResponseEntity<Usuario> response = adminController.actualizarUsuario(999, usuario);

        // Assert
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    void listarEstados_RetornaListaEstados() {
        // Arrange
        List<EstadoUsuario> estados = Arrays.asList(
                EstadoUsuario.builder().idEstado(1).nombreEstado("Activo").build(),
                EstadoUsuario.builder().idEstado(2).nombreEstado("Inactivo").build()
        );
        when(administradorService.listarTodosEstadosUsuario()).thenReturn(estados);

        // Act
        ResponseEntity<List<EstadoUsuario>> response = adminController.listarEstados();

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(2, response.getBody().size());
    }

    @Test
    void eliminarUsuario_UsuarioExistente_RetornaNoContent() {
        // Arrange
        when(administradorService.eliminarUsuarioLogico(1)).thenReturn(true);

        // Act
        ResponseEntity<Void> response = adminController.eliminarUsuario(1);

        // Assert
        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
    }

    @Test
    void eliminarUsuario_UsuarioNoExistente_RetornaNotFound() {
        // Arrange
        when(administradorService.eliminarUsuarioLogico(999)).thenReturn(false);

        // Act
        ResponseEntity<Void> response = adminController.eliminarUsuario(999);

        // Assert
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    void exportarUsuariosAExcel_Success_RetornaArchivo() throws IOException {
        // Arrange
        List<Usuario> usuarios = Arrays.asList(
                Usuario.builder().id(1).correo("test1@test.com").build(),
                Usuario.builder().id(2).correo("test2@test.com").build()
        );
        byte[] excelBytes = new byte[]{1, 2, 3};

        when(administradorService.obtenerListaDeUsuariosParaExportar()).thenReturn(usuarios);
        when(excelExportService.exportUsersToExcel(usuarios)).thenReturn(excelBytes);

        // Act
        ResponseEntity<byte[]> response = adminController.exportarUsuariosAExcel();

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertTrue(response.getHeaders().getContentDisposition().getFilename().contains("usuarios_finli_"));
    }

    @Test
    void exportarUsuariosAExcel_IOException_RetornaErrorInterno() throws IOException {
        // Arrange
        List<Usuario> usuarios = Arrays.asList(Usuario.builder().id(1).build());
        when(administradorService.obtenerListaDeUsuariosParaExportar()).thenReturn(usuarios);
        when(excelExportService.exportUsersToExcel(usuarios)).thenThrow(new IOException());

        // Act
        ResponseEntity<byte[]> response = adminController.exportarUsuariosAExcel();

        // Assert
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
    }
}
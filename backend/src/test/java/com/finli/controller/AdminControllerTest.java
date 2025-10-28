package com.finli.controller;

import com.finli.dto.PaginacionUsuarioResponse;
import com.finli.dto.UsuarioResponse;
import com.finli.model.Usuario;
import com.finli.service.AdministradorService;
import com.finli.service.ExcelExportService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Arrays;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AdminControllerTest {

    @Mock
    private AdministradorService administradorService;

    @Mock
    private ExcelExportService excelExportService;

    @InjectMocks
    private AdminController adminController;

    @Test
    void getUsuariosPaginadosYFiltrados_ParametrosValidos_RetornaLista() {
        // Arrange
        UsuarioResponse usuarioResponse = UsuarioResponse.builder()
                .id(1)
                .correo("test@example.com")
                .nombre("Test")
                .build();

        PaginacionUsuarioResponse response = new PaginacionUsuarioResponse(
                Arrays.asList(usuarioResponse),
                1L
        );

        when(administradorService.getUsuariosPaginadosYFiltrados(1, 10, "all")).thenReturn(response);

        // Act
        ResponseEntity<PaginacionUsuarioResponse> result = adminController.getUsuariosPaginadosYFiltrados(1, 10, "all");

        // Assert
        assertEquals(HttpStatus.OK, result.getStatusCode());
        assertNotNull(result.getBody());
        assertEquals(1, result.getBody().getTotalCount());
        assertEquals(1, result.getBody().getUsers().size());
    }
}
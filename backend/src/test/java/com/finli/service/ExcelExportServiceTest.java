package com.finli.service;

import com.finli.model.EstadoUsuario;
import com.finli.model.Usuario;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class ExcelExportServiceTest {

    @InjectMocks
    private ExcelExportService excelExportService;

    @Test
    void exportUsersToExcel_UsuariosValidos_GeneraExcel() throws IOException {
        // Arrange
        EstadoUsuario estado = EstadoUsuario.builder()
                .idEstado(1)
                .nombreEstado("Activo")
                .build();

        List<Usuario> usuarios = Arrays.asList(
                Usuario.builder()
                        .id(1)
                        .nombre("Juan")
                        .apellidoPaterno("Pérez")
                        .apellidoMaterno("Gómez")
                        .correo("juan@test.com")
                        .edad(30)
                        .estadoUsuario(estado)
                        .build()
        );

        // Act
        byte[] result = excelExportService.exportUsersToExcel(usuarios);

        // Assert
        assertNotNull(result);
        assertTrue(result.length > 0);

        // Verificar estructura del Excel
        try (Workbook workbook = new XSSFWorkbook(new java.io.ByteArrayInputStream(result))) {
            Sheet sheet = workbook.getSheetAt(0);
            assertEquals("Reporte_Usuarios_FinLi", sheet.getSheetName());

            Row headerRow = sheet.getRow(0);
            assertEquals("ID", headerRow.getCell(0).getStringCellValue());
            assertEquals("Nombre", headerRow.getCell(1).getStringCellValue());
        }
    }

    @Test
    void exportUsersToExcel_ListaVacia_GeneraExcelVacio() throws IOException {
        // Arrange
        List<Usuario> usuarios = Arrays.asList();

        // Act
        byte[] result = excelExportService.exportUsersToExcel(usuarios);

        // Assert
        assertNotNull(result);
        assertTrue(result.length > 0);
    }
}
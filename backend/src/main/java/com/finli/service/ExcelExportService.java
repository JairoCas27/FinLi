package com.finli.service;

import com.finli.model.Usuario;
import com.finli.model.Suscripcion; // Importante
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Arrays;
import java.util.List;

@Service
public class ExcelExportService {

    // 1. ACTUALIZAMOS LOS ENCABEZADOS
    private static final List<String> HEADERS = Arrays.asList(
            "ID", "Nombre", "Apellido Paterno", "Apellido Materno",
            "Correo", "Edad", "Rol", "Suscripción Actual", "Estado");

    public byte[] exportUsersToExcel(List<Usuario> usuarios) throws IOException {

        try (Workbook workbook = new XSSFWorkbook();
             ByteArrayOutputStream out = new ByteArrayOutputStream()) {

            Sheet sheet = workbook.createSheet("Reporte_Usuarios_FinLi");

            // Estilos
            CellStyle headerCellStyle = createHeaderStyle(workbook);
            
            // Crear Fila de Encabezados
            Row headerRow = sheet.createRow(0);
            for (int col = 0; col < HEADERS.size(); col++) {
                Cell cell = headerRow.createCell(col);
                cell.setCellValue(HEADERS.get(col));
                cell.setCellStyle(headerCellStyle);
            }

            // Llenar Datos
            int rowIdx = 1;
            for (Usuario user : usuarios) {
                Row row = sheet.createRow(rowIdx++);

                row.createCell(0).setCellValue(user.getId());
                row.createCell(1).setCellValue(user.getNombre());
                row.createCell(2).setCellValue(user.getApellidoPaterno());
                row.createCell(3).setCellValue(user.getApellidoMaterno());
                row.createCell(4).setCellValue(user.getCorreo());
                row.createCell(5).setCellValue(user.getEdad());
                
                // --- NUEVO: ROL ---
                row.createCell(6).setCellValue(user.getRol());

                // --- NUEVO: LÓGICA PARA OBTENER SUSCRIPCIÓN ACTIVA ---
                String suscripcionActual = "Gratuito"; // Valor por defecto
                if (user.getSuscripciones() != null) {
                    suscripcionActual = user.getSuscripciones().stream()
                        .filter(s -> s.getEstadoSuscripcion().getIdEstadoSuscripcion() == 1) // 1 = Activa
                        .map(s -> s.getTipoSuscripcion().getNombreTipoSuscripcion())
                        .findFirst()
                        .orElse("Gratuito"); // Si no tiene activa, asumimos gratuito o sin suscripción
                }
                row.createCell(7).setCellValue(suscripcionActual);

                // ESTADO
                String estado = (user.getEstadoUsuario() != null)
                        ? user.getEstadoUsuario().getNombreEstado()
                        : "Desconocido";
                row.createCell(8).setCellValue(estado);
            }

            // Autoajustar columnas
            for (int i = 0; i < HEADERS.size(); i++) {
                sheet.autoSizeColumn(i);
            }

            workbook.write(out);
            return out.toByteArray();
        }
    }

    private CellStyle createHeaderStyle(Workbook workbook) {
        CellStyle headerCellStyle = workbook.createCellStyle();
        Font headerFont = workbook.createFont();
        headerFont.setBold(true);
        headerFont.setColor(IndexedColors.WHITE.getIndex()); // Letra blanca para contraste
        headerCellStyle.setFont(headerFont);
        
        // Fondo verde corporativo (o gris oscuro)
        headerCellStyle.setFillForegroundColor(IndexedColors.SEA_GREEN.getIndex());
        headerCellStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        
        return headerCellStyle;
    }
}
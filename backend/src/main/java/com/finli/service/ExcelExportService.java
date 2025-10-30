package com.finli.service;

import com.finli.model.Usuario;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Arrays;
import java.util.List;

@Service
public class ExcelExportService {

    private static final List<String> HEADERS = Arrays.asList(
            "ID", "Nombre", "Apellido Paterno", "Apellido Materno",
            "Correo", "Edad", "Estado");

    public byte[] exportUsersToExcel(List<Usuario> usuarios) throws IOException {

        try (Workbook workbook = new XSSFWorkbook();
                ByteArrayOutputStream out = new ByteArrayOutputStream()) {

            Sheet sheet = workbook.createSheet("Reporte_Usuarios_FinLi");

            CellStyle headerCellStyle = createHeaderStyle(workbook);

            Row headerRow = sheet.createRow(0);
            for (int col = 0; col < HEADERS.size(); col++) {
                Cell cell = headerRow.createCell(col);
                cell.setCellValue(HEADERS.get(col));
                cell.setCellStyle(headerCellStyle);
            }

            int rowIdx = 1;
            for (Usuario user : usuarios) {
                Row row = sheet.createRow(rowIdx++);

                row.createCell(0).setCellValue(user.getId());
                row.createCell(1).setCellValue(user.getNombre());
                row.createCell(2).setCellValue(user.getApellidoPaterno());
                row.createCell(3).setCellValue(user.getApellidoMaterno());
                row.createCell(4).setCellValue(user.getCorreo());
                row.createCell(5).setCellValue(user.getEdad());

                String estado = (user.getEstadoUsuario() != null)
                        ? user.getEstadoUsuario().getNombreEstado()
                        : "N/A";
                row.createCell(6).setCellValue(estado);
            }

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
        headerCellStyle.setFont(headerFont);

        headerCellStyle.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());
        headerCellStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);

        return headerCellStyle;
    }
}
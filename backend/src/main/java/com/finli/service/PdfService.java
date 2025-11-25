package com.finli.service;

import com.finli.model.Usuario;
import com.finli.model.TipoSuscripcion;
import com.finli.model.Suscripcion;
import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfWriter;
import org.springframework.stereotype.Service;

import java.io.FileOutputStream;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
public class PdfService {

    public String generarReciboPDF(Usuario usuario, TipoSuscripcion tipo, Suscripcion suscripcion, String last4Digits) {
        try {
            String filePath = "recibo_" + usuario.getId() + "_" + System.currentTimeMillis() + ".pdf";

            Document document = new Document();
            PdfWriter.getInstance(document, new FileOutputStream(filePath));
            document.open();

            Font titleFont = new Font(Font.FontFamily.HELVETICA, 20, Font.BOLD);
            Font normalFont = new Font(Font.FontFamily.HELVETICA, 12);

            document.add(new Paragraph("FINLI - RECIBO DE SUSCRIPCIÓN", titleFont));
            document.add(new Paragraph("\n"));
            document.add(new Paragraph("Usuario: " + usuario.getNombre(), normalFont));
            document.add(new Paragraph("Correo: " + usuario.getCorreo(), normalFont));
            document.add(new Paragraph("Plan adquirido: " + tipo.getNombreTipoSuscripcion(), normalFont));
            document.add(new Paragraph("Fecha de inicio: " + suscripcion.getFechaInicio(), normalFont));
            document.add(new Paragraph("Fecha de fin: " + (suscripcion.getFechaFin() != null ? suscripcion.getFechaFin() : "Ilimitada"), normalFont));
            document.add(new Paragraph("Últimos 4 dígitos de tarjeta: **** **** **** " + last4Digits, normalFont));
            document.add(new Paragraph("\nFecha de operación: " +
                    LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss"))));

            document.close();
            return filePath;

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("No se pudo crear el PDF.");
        }
    }
}

package com.finli.service;

import org.apache.commons.mail.EmailAttachment;
import org.apache.commons.mail.MultiPartEmail;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Value("${mail.smtp.host}")
    private String host;

    @Value("${mail.smtp.port}")
    private int port;

    @Value("${mail.smtp.username}")
    private String username;

    @Value("${mail.smtp.password}")
    private String password;

    @Value("${mail.smtp.starttls.enable}")
    private boolean startTlsEnable;

    @Value("${mail.smtp.auth}")
    private boolean auth;

    // 📌 ENVÍO DE EMAIL SIMPLE (si alguna vez lo usas)
    public void sendEmail(String toEmail, String subject, String msg) {
        try {
            MultiPartEmail email = new MultiPartEmail();
            email.setHostName(host);
            email.setSmtpPort(port);
            email.setAuthentication(username, password);
            email.setStartTLSEnabled(startTlsEnable);
            email.setFrom(username);
            email.setSubject(subject);
            email.setMsg(msg);
            email.addTo(toEmail);

            email.send();

        } catch (Exception e) {
            System.err.println("Error al enviar correo simple a " + toEmail + ": " + e.getMessage());
            throw new RuntimeException("Fallo al enviar correo simple.", e);
        }
    }

    // 📌 ENVÍO DE EMAIL CON PDF ADJUNTO (RECIBO DE PAGO)
    public void sendEmailWithAttachment(String toEmail, String subject, String msg, String filePath) {
        try {
            MultiPartEmail email = new MultiPartEmail();
            email.setHostName(host);
            email.setSmtpPort(port);
            email.setAuthentication(username, password);
            email.setStartTLSEnabled(startTlsEnable);
            email.setFrom(username);
            email.setSubject(subject);
            email.setMsg(msg);
            email.addTo(toEmail);

            // Crear adjunto
            EmailAttachment attachment = new EmailAttachment();
            attachment.setPath(filePath);
            attachment.setDisposition(EmailAttachment.ATTACHMENT);
            attachment.setDescription("Recibo de suscripción");
            attachment.setName("Recibo_FinLi.pdf");

            // Adjuntar
            email.attach(attachment);

            // Enviar
            email.send();

            System.out.println("📨 Email con recibo enviado correctamente a: " + toEmail);

        } catch (Exception e) {
            System.err.println("❌ Error al enviar correo con PDF a " + toEmail + ": " + e.getMessage());
            throw new RuntimeException("Fallo al enviar correo con adjunto.", e);
        }
    }
}

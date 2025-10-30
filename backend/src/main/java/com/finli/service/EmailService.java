package com.finli.service;

import org.apache.commons.mail.EmailException;
import org.apache.commons.mail.HtmlEmail;
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
    @Value("${mail.smtp.starttls.enable:false}")
    private boolean startTlsEnable;
    @Value("${mail.smtp.auth:true}")
    private boolean auth;
    @Value("${mail.smtp.charset:UTF-8}")
    private String charset;

    public void sendHtmlEmail(String toEmail, String subject, String htmlBody, String textFallback) {
        HtmlEmail email = new HtmlEmail();
        try {
            email.setHostName(host);
            email.setSmtpPort(port);
            if (auth) {
                email.setAuthentication(username, password);
            }
            email.setStartTLSEnabled(startTlsEnable);
            email.setFrom(username);
            email.setSubject(subject);
            email.setCharset(charset);

            // HTML + texto plano fallback
            email.setHtmlMsg(htmlBody);
            if (textFallback != null && !textFallback.isBlank()) {
                email.setTextMsg(textFallback);
            } else {
                // si no provees fallback, extrae texto simple básico
                email.setTextMsg(stripHtmlToPlain(htmlBody));
            }

            email.addTo(toEmail);
            email.send();

        } catch (EmailException e) {
            System.err.println("Error al enviar correo a " + toEmail + ": " + e.getMessage());
            throw new RuntimeException("Fallo al enviar correo. Revise configuración SMTP.", e);
        }
    }

    // Método auxiliar simple para generar texto plano desde HTML (muy básico)
    private String stripHtmlToPlain(String html) {
        if (html == null) return "";
        return html.replaceAll("(?s)<[^>]*>", "") // quita tags
                    .replaceAll("&nbsp;", " ")
                    .replaceAll("&amp;", "&")
                    .trim();
    }

    // Opcional: mantener compatibilidad con envíos simples de texto
    public void sendEmail(String toEmail, String subject, String msg) {
        sendHtmlEmail(toEmail, subject, "<pre>" + msg + "</pre>", msg);
    }
}

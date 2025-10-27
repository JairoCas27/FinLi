package com.finli.service;

import org.apache.commons.mail.Email;
import org.apache.commons.mail.SimpleEmail;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    // Inyecta las propiedades de mail.smtp.* desde application.properties
    @Value("${mail.smtp.host}")
    private String host;
    @Value("${mail.smtp.port}")
    private int port;
    @Value("${mail.smtp.username}")
    private String username;
    @Value("${mail.smtp.password}")
    private String password;
    
    // Configuraciones de STARTTLS/AUTH
    @Value("${mail.smtp.starttls.enable}")
    private boolean startTlsEnable; 
    @Value("${mail.smtp.auth}")
    private boolean auth;


    /**
     * Envía un correo simple con el token de recuperación.
     * @param toEmail Correo del destinatario (el usuario que recupera la clave).
     * @param subject Asunto del correo.
     * @param msg 
     */
    public void sendEmail(String toEmail, String subject, String msg) {
        try {
            Email email = new SimpleEmail();
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
            System.err.println("Error al enviar el correo a " + toEmail + ": " + e.getMessage());
            throw new RuntimeException("Fallo al enviar el correo. Revise configuración SMTP y dependencias.", e);
        }
    }
}
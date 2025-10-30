package com.finli.service;

import com.finli.dto.RegistroRequest;
import com.finli.dto.UsuarioResponse;
import com.finli.model.Usuario;
import com.finli.model.EstadoUsuario;
import com.finli.model.PasswordResetToken;
import com.finli.repository.EstadoUsuarioRepository;
import com.finli.repository.UsuarioRepository;
import com.finli.repository.PasswordResetTokenRepository;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import com.google.common.base.Preconditions;
import org.mindrot.jbcrypt.BCrypt;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.finli.dto.PasswordResetRequest;
import java.time.LocalDateTime;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ServicioAutenticacion {

    private final UsuarioRepository repo; 
    private final EstadoUsuarioRepository estadoUsuarioRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final EmailService emailService;

    public Optional<Usuario> buscarPorCorreo(String correo) {
        Preconditions.checkArgument(StringUtils.isNotBlank(correo), "El correo no puede estar vacío");
        return repo.findByCorreo(correo);
    }

    public Usuario registrar(RegistroRequest dto) {
        if (!dto.getContrasena().equals(dto.getConfirmarContrasena())) {
            throw new RuntimeException("Las contraseñas no coinciden");
        }
        if (repo.existsByCorreo(dto.getEmail())) {
            throw new RuntimeException("Correo ya registrado");
        }

        EstadoUsuario estadoPorDefecto = estadoUsuarioRepository.findById(1)
                .orElseThrow(() -> new RuntimeException("Error: Estado de usuario por defecto (ID 1) no encontrado."));

        Usuario u = Usuario.builder()
                .nombre(dto.getNombre())
                .apellidoPaterno(dto.getApellidoPaterno())
                .apellidoMaterno(dto.getApellidoMaterno())
                .edad(dto.getEdad())
                .correo(dto.getEmail())
                .contrasena(BCrypt.hashpw(dto.getContrasena(), BCrypt.gensalt()))
                .estadoUsuario(estadoPorDefecto)
                .build();
        return repo.save(u);
    }

    public Usuario login(String email, String rawPassword) {
        Usuario u = repo.findByCorreo(email)
                .orElseThrow(() -> new RuntimeException("Credenciales inválidas"));
        if (!BCrypt.checkpw(rawPassword, u.getContrasena())) {
            throw new RuntimeException("Credenciales inválidas");
        }
        return u;
    }

@Transactional
public void iniciarRecuperacion(String email) {
    Usuario usuario = repo.findByCorreo(email)
            .orElseThrow(() -> new RuntimeException("Correo no registrado."));

    String token = String.valueOf((int) (Math.random() * 900000) + 100000);

    passwordResetTokenRepository.deleteByUsuarioId(usuario.getId());

    PasswordResetToken resetToken = new PasswordResetToken(token, usuario);
    passwordResetTokenRepository.save(resetToken);

    String subject = "🔐 Recuperación de Contraseña - FinLi";
    
    String msg = String.format(
        "<!DOCTYPE html>" +
        "<html lang='es'>" +
        "<head>" +
        "    <meta charset='UTF-8'>" +
        "    <meta name='viewport' content='width=device-width, initial-scale=1.0'>" +
        "    <title>Recuperación de Contraseña - FinLi</title>" +
        "    <style>" +
        "        * { margin: 0; padding: 0; box-sizing: border-box; }" +
        "        body { font-family: 'Arial', sans-serif; background: #f5f7fb; margin: 0; padding: 20px; text-align: center; }" +
        "        .email-container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); display: inline-block; text-align: left; }" +
        "        .header { background: #0ea46f; padding: 30px; text-align: center; }" +
        "        .header h1 { color: white; font-size: 28px; margin-bottom: 10px; }" +
        "        .header p { color: white; opacity: 0.9; margin: 0; }" +
        "        .content { padding: 40px 30px; }" +
        "        .greeting { font-size: 20px; color: #333; margin-bottom: 20px; text-align: center; }" +
        "        .message { color: #555; line-height: 1.6; margin-bottom: 30px; text-align: center; }" +
        "        .token { font-size: 48px; font-weight: bold; color: #0ea46f; letter-spacing: 8px; margin: 25px 0; padding: 20px; background: #f8f9fa; border-radius: 8px; font-family: 'Courier New', monospace; text-align: center; }" +
        "        .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 8px; margin: 20px 0; text-align: center; }" +
        "        .footer { background: #f8f9fa; padding: 25px; border-top: 1px solid #dee2e6; text-align: center; }" +
        "        .footer-text { color: #666; line-height: 1.6; }" +
        "        .center { text-align: center; }" +
        "        @media (max-width: 600px) {" +
        "            .content { padding: 30px 20px; }" +
        "            .token { font-size: 36px; letter-spacing: 6px; padding: 15px; }" +
        "            .header { padding: 20px; }" +
        "        }" +
        "    </style>" +
        "</head>" +
        "<body>" +
        "    <center>" +
        "    <div class='email-container'>" +
        "        <div class='header'>" +
        "            <h1>FinLi</h1>" +
        "            <p>Seguimiento financiero Personalizado</p>" +
        "        </div>" +
        "        " +
        "        <div class='content'>" +
        "            <div class='greeting'>Hola %s,</div>" +
        "            " +
        "            <div class='message'>" +
        "                Has solicitado restablecer tu contraseña en FinLi. Para completar el proceso, utiliza el siguiente código de verificación:" +
        "            </div>" +
        "            " +
        "            <div class='token'>%s</div>" +
        "            " +
        "            <div class='center' style='color: #666; margin-bottom: 20px;'>Este código es válido por 10 minutos</div>" +
        "            " +
        "            <div class='warning'>" +
        "                <strong>IMPORTANTE:</strong> Por seguridad, no compartas este código con nadie. El equipo de FinLi nunca te pedirá tu código de verificación." +
        "            </div>" +
        "            " +
        "            <div class='center' style='margin-top: 30px; color: #666;'>" +
        "                Si no solicitaste este cambio, puedes ignorar este mensaje." +
        "            </div>" +
        "        </div>" +
        "        " +
        "        <div class='footer'>" +
        "            <div class='footer-text'>" +
        "                <strong>FinLi © 2024</strong><br>" +
        "                Tu aplicación de gestión financiera personal<br>" +
        "                Este es un mensaje automático, por favor no respondas a este correo" +
        "            </div>" +
        "        </div>" +
        "    </div>" +
        "    </center>" +
        "</body>" +
        "</html>",
        usuario.getNombre(), token
    );

    emailService.sendEmail(email, subject, msg);
}

    @Transactional
    public void restablecerContrasena(PasswordResetRequest request) {

        PasswordResetToken tokenEntity = passwordResetTokenRepository.findByToken(request.getToken())
            .orElseThrow(() -> new RuntimeException("Código de recuperación inválido o no encontrado."));

        if (!tokenEntity.getUsuario().getCorreo().equalsIgnoreCase(request.getEmail())) {
             throw new RuntimeException("El código no corresponde al correo proporcionado.");
        }

        if (tokenEntity.getExpiryDate().isBefore(LocalDateTime.now())) {

            passwordResetTokenRepository.delete(tokenEntity);
            throw new RuntimeException("El código de recuperación ha expirado. Por favor, solicite uno nuevo.");
        }

        Usuario usuario = tokenEntity.getUsuario();
 
        String nuevaContrasenaCodificada = BCrypt.hashpw(request.getNuevaContrasena(), BCrypt.gensalt());
        usuario.setContrasena(nuevaContrasenaCodificada);

        repo.save(usuario); 

        passwordResetTokenRepository.delete(tokenEntity);
    }

    public UsuarioResponse toResponse(Usuario u) {
        return UsuarioResponse.builder()
                .id(u.getId())
                .correo(u.getCorreo())
                .nombre(u.getNombre())
                .apellidoPaterno(u.getApellidoPaterno())
                .apellidoMaterno(u.getApellidoMaterno())
                .edad(u.getEdad())
                .build();
    }
}
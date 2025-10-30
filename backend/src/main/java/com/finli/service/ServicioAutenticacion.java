package com.finli.service;

import com.finli.dto.PasswordResetRequest;
import com.finli.dto.RegistroRequest;
import com.finli.dto.UsuarioResponse;
import com.finli.model.EstadoUsuario;
import com.finli.model.PasswordResetToken;
import com.finli.model.Usuario;
import com.finli.repository.EstadoUsuarioRepository;
import com.finli.repository.UsuarioRepository;
import com.finli.repository.PasswordResetTokenRepository;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import com.google.common.base.Preconditions;
import org.mindrot.jbcrypt.BCrypt;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ServicioAutenticacion {

    private final UsuarioRepository repo;
    private final EstadoUsuarioRepository estadoUsuarioRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final EmailService emailService;

    /* ========== METODO BUSCAR POR CORREO ========== */
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

        String subject = "Código de Recuperación de Contraseña - FinLiApp";
        String msg = String.format(
                "Estimado(a) %s,\n\n" +
                        "Su código de verificación para restablecer su contraseña es: **%s**\n\n" +
                        "Este código es válido por 10 minutos.\n\n" +
                        "Si usted no solicitó este cambio, ignore este correo.\n\n" +
                        "Atentamente,\nEquipo FinLi",
                usuario.getNombre(), token);

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
                .email(u.getCorreo())
                .nombre(u.getNombre())
                .apellidoPaterno(u.getApellidoPaterno())
                .apellidoMaterno(u.getApellidoMaterno())
                .edad(u.getEdad())
                .build();
    }
}
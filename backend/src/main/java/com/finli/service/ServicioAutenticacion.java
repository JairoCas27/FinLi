package com.finli.service;

import com.finli.dto.RegistroRequest;
import com.finli.dto.UsuarioResponse;
import com.finli.model.Usuario;
import com.finli.model.EstadoUsuario; 
import com.finli.repository.EstadoUsuarioRepository;
import com.finli.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import com.google.common.base.Preconditions;
import org.mindrot.jbcrypt.BCrypt;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ServicioAutenticacion {

    private final UsuarioRepository repo;

    private final EstadoUsuarioRepository estadoUsuarioRepository;

    /* ========== NUEVO MÉTODO QUE TE FALTABA ========== */
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
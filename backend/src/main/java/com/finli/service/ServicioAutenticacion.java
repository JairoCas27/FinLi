package com.finli.service;

import com.finli.dto.RegistroRequest;
import com.finli.dto.UsuarioResponse;
import com.finli.model.Usuario;
import com.finli.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.mindrot.jbcrypt.BCrypt;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ServicioAutenticacion {

    private final UsuarioRepository repo;

    public Usuario registrar(RegistroRequest dto) {
        if (!dto.getContrasena().equals(dto.getConfirmarContrasena())) {
            throw new RuntimeException("Las contraseñas no coinciden");
        }
        if (repo.existsByCorreo(dto.getEmail())) {
            throw new RuntimeException("Correo ya registrado");
        }
        Usuario u = Usuario.builder()
                .nombre(dto.getNombre())
                .apellidoPaterno(dto.getApellidoPaterno())
                .apellidoMaterno(dto.getApellidoMaterno())
                .edad(dto.getEdad())
                .correo(dto.getEmail())
                .contrasena(BCrypt.hashpw(dto.getContrasena(), BCrypt.gensalt()))
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
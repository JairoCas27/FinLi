package com.finli.service;

import com.finli.model.Usuario;
import com.finli.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.mindrot.jbcrypt.BCrypt;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ServicioAutenticacion {

    private final UsuarioRepository repo;

    public Usuario registrar(String nombre, String apellido, String email, String rawPassword) {
        if (repo.existsByEmail(email)) {
            throw new RuntimeException("Email ya registrado");
        }
        Usuario u = new Usuario();
        u.setFullName(nombre + " " + apellido);
        u.setEmail(email);
        u.setPassword(BCrypt.hashpw(rawPassword, BCrypt.gensalt()));
        u.setRole("USER");
        return repo.save(u);
    }

    public Usuario login(String email, String rawPassword) {
        Usuario u = repo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        if (!BCrypt.checkpw(rawPassword, u.getPassword())) {
            throw new RuntimeException("Credenciales inválidas");
        }
        return u;
    }
}

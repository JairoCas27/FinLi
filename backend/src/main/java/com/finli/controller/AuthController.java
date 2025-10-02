package com.finli.controller;

import com.finli.dto.LoginRequest;
import com.finli.dto.RegistroRequest;
import com.finli.model.Usuario;
import com.finli.service.ServicioAutenticacion;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class AuthController {

    private final ServicioAutenticacion servicio;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest dto) {
        try {
            Usuario u = servicio.login(dto.getEmail(), dto.getContrasena());
            return ResponseEntity.ok(u);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegistroRequest dto) {
        if (!dto.getContrasena().equals(dto.getConfirmarContrasena())) {
            return ResponseEntity.badRequest().body("Las contraseñas no coinciden");
        }
        try {
            Usuario u = servicio.registrar(dto.getNombre(), dto.getApellido(),
                    dto.getEmail(), dto.getContrasena());
            return ResponseEntity.ok("Usuario creado ID: " + u.getId());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
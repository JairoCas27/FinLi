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
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {

    private final ServicioAutenticacion servicio;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest dto) {
        try {
            Usuario u = servicio.login(dto.getEmail(), dto.getContrasena());
            // antes: return ResponseEntity.ok(u);
            return ResponseEntity.ok(servicio.toResponse(u));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegistroRequest dto) {
        try {
            Usuario u = servicio.registrar(dto);
            return ResponseEntity.ok("Usuario creado ID: " + u.getId());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
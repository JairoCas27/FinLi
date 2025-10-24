package com.finli.controller;

import com.finli.dto.UsuarioResponse;
import com.finli.service.AdministradorService; // ¡CORRECCIÓN EN EL NOMBRE!
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AdminController {

    private final AdministradorService administradorService; // ¡CORRECCIÓN EN EL NOMBRE!

    @GetMapping("/usuarios")
    public ResponseEntity<List<UsuarioResponse>> listarUsuarios() {
        List<UsuarioResponse> usuarios = administradorService.obtenerTodosLosUsuarios(); // ¡CORRECCIÓN EN EL NOMBRE!
        return ResponseEntity.ok(usuarios);
    }
}
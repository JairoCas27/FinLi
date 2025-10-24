package com.finli.controller;

import com.finli.model.MedioPago;
import com.finli.model.Usuario;
import com.finli.repository.MedioPagoRepository;
import com.finli.service.ServicioAutenticacion;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/medios-pago")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class MedioPagoController {

    private final MedioPagoRepository repo;
    private final ServicioAutenticacion authService;

    @GetMapping
    public ResponseEntity<List<MedioPago>> listarPorUsuario(@RequestParam String email) {
        Usuario usuario = authService.buscarPorCorreo(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        return ResponseEntity.ok(repo.findByUsuario(usuario));
    }
}
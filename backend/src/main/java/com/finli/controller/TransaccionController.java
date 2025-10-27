package com.finli.controller;

import com.finli.dto.TransaccionRequest;
import com.finli.model.Transaccion;
import com.finli.service.TransaccionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/transacciones")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Slf4j
public class TransaccionController {

    private final TransaccionService service;

    @PostMapping
    public ResponseEntity<?> guardar(@RequestBody TransaccionRequest dto) {
        try {
            Transaccion t = service.guardar(dto);
            log.info("Transacción guardada exitosamente: ID={}", t.getIdTransaccion());
            return ResponseEntity.ok("Transacción guardada ID: " + t.getIdTransaccion());
        } catch (IllegalArgumentException e) {
            log.warn("Error al guardar transacción: {}", e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            log.error("Error inesperado al guardar transacción", e);
            return ResponseEntity.status(500).body("Error interno al guardar transacción");
        }
    }

    @GetMapping
    public ResponseEntity<List<Transaccion>> listar(
            @RequestParam String email,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime inicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fin) {
        try {
            List<Transaccion> lista = service.listarPorUsuarioYPeriodo(email, inicio, fin);
            log.info("Transacciones listadas: {} para usuario: {}", lista.size(), email);
            return ResponseEntity.ok(lista);
        } catch (IllegalArgumentException e) {
            log.warn("Error al listar transacciones: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }
}
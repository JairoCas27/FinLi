package com.finli.controller;

import com.finli.dto.UserAdminDTO;
import com.finli.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam; // <-- IMPORTANTE: Nueva importación
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminUsuarioController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @GetMapping("/users")
    // MODIFICADO: Ahora acepta un parámetro opcional "search" (ej: /api/admin/users?search=Juan)
    public ResponseEntity<List<UserAdminDTO>> listarUsuariosParaAdmin(@RequestParam(value = "search", required = false) String search) {
        
        // 1. Llamamos al repositorio pasando el parámetro de búsqueda (puede ser null o texto)
        List<UsuarioRepository.UserAdminProjection> dbUsers = usuarioRepository.obtenerDatosAdmin(search);

        // 2. Convertimos los resultados al DTO
        List<UserAdminDTO> response = dbUsers.stream().map(proj -> {
            String nombreCompleto = proj.getNombre() + " " + proj.getApellido();
            
            return new UserAdminDTO(
                proj.getId(),
                nombreCompleto,
                proj.getEmail(),
                proj.getSuscripcion(),
                "2024-01-01", // Fecha fija temporal
                null          // Foto null
            );
        }).collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }
}
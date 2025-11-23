package com.finli.controller;

import com.finli.dto.CategoriaDTO;
import com.finli.service.AdministradorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*") // Permite que el HTML local consuma la API
public class AdminApartadosController {

    @Autowired
    private AdministradorService administradorService;

    // --- 1. LISTAR CATEGORÍAS PREDETERMINADAS (GET) ---
    // Endpoint: /api/admin/categories
    @GetMapping("/categories")
    public ResponseEntity<List<CategoriaDTO>> listarCategorias() {
        // Llamamos al método nuevo que creamos en el servicio
        // Este método ya devuelve la lista con el conteo de subcategorías, iconos y colores
        List<CategoriaDTO> categorias = administradorService.listarCategoriasPredeterminadas();
        
        return ResponseEntity.ok(categorias);
    }
}

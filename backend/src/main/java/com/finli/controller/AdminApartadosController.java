package com.finli.controller;

import com.finli.dto.CategoriaDTO;
import com.finli.dto.SubcategoriaDTO; // <-- IMPORTANTE: Nuevo DTO
import com.finli.service.AdministradorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable; // <-- IMPORTANTE: Necesario para el ID
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
        List<CategoriaDTO> categorias = administradorService.listarCategoriasPredeterminadas();
        return ResponseEntity.ok(categorias);
    }

    // --- 2. LISTAR SUBCATEGORÍAS POR CATEGORÍA (GET) ---
    // Endpoint: /api/admin/categories/{id}/subcategories
    @GetMapping("/categories/{id}/subcategories")
    public ResponseEntity<List<SubcategoriaDTO>> listarSubcategoriasPorCategoria(@PathVariable Integer id) {
        try {
            // Llamamos al método nuevo que devuelve el DTO de subcategorías
            List<SubcategoriaDTO> subcategorias = administradorService.obtenerSubcategoriasPorCategoria(id);
            return ResponseEntity.ok(subcategorias);
        } catch (RuntimeException e) {
            // Manejamos el caso de que el ID de categoría no exista
            return ResponseEntity.notFound().build();
        }
    }
}

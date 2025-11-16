package com.finli.controller;

import com.finli.model.Categoria;
import com.finli.model.Subcategoria;
import com.finli.model.Usuario;
import com.finli.service.CategoriaService;
import com.finli.service.ServicioAutenticacion;
import com.finli.dto.CrearCategoriaRequest; // Importación del DTO
import com.finli.dto.CrearSubcategoriaRequest; // Importación del DTO
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categorias") // Mantengo tu ruta base
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CategoriaController {

    private final CategoriaService categoriaService;
    private final ServicioAutenticacion authService;

    // --- MÉTODOS EXISTENTES (Se mantienen) ---
    
    @GetMapping
    public ResponseEntity<List<Categoria>> listarPorUsuario(@RequestParam String email) {
        Usuario usuario = authService.buscarPorCorreo(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        return ResponseEntity.ok(categoriaService.obtenerCategoriasPorUsuario(usuario));
    }

    @GetMapping("/{id}/subcategorias")
    public ResponseEntity<List<Subcategoria>> subcategoriasPorCategoriaYUsuario(
            @PathVariable Integer id,
            @RequestParam String email) {
        Usuario usuario = authService.buscarPorCorreo(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        // Simplifico la búsqueda de la categoría
        Categoria categoria = categoriaService.buscarPorId(id)
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));
        
        return ResponseEntity.ok(categoriaService.obtenerSubcategoriasPorCategoriaYUsuario(categoria, usuario));
    }
    
    // 💡 NUEVO ENDPOINT CRÍTICO: Para obtener solo categorías base/globales (soluciona error de carga inicial)
    // GET /api/categorias/base
    @GetMapping("/base") 
    public ResponseEntity<List<Categoria>> obtenerCategoriasBase() {
        // Usa el nuevo método del servicio que devuelve las categorías con id_usuario = NULL
        List<Categoria> categoriasBase = categoriaService.obtenerCategoriasBase();
        return ResponseEntity.ok(categoriasBase);
    }

    // --- MÉTODOS ACTUALIZADOS (Creación con DTOs) ---

    // POST /api/categorias
    @PostMapping
    public ResponseEntity<Categoria> crearCategoria(@RequestBody CrearCategoriaRequest request, @RequestParam String email) {
        // 1. Obtener el Usuario
        Usuario usuario = authService.buscarPorCorreo(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // 2. Asignar el ID del usuario al Request (para que el Service lo use)
        request.setIdUsuario(usuario.getId()); 
        
        try {
            // 3. Llamar al nuevo método del servicio que maneja el DTO y la FuenteCategoria
            Categoria nuevaCategoria = categoriaService.crearCategoria(request);
            return new ResponseEntity<>(nuevaCategoria, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build(); 
        } catch (RuntimeException e) {
             return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // POST /api/categorias/subcategorias
    @PostMapping("/subcategorias")
    public ResponseEntity<Subcategoria> crearSubcategoria(@RequestBody CrearSubcategoriaRequest request, @RequestParam String email) {
        // 1. Obtener el Usuario
        Usuario usuario = authService.buscarPorCorreo(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        
        // 2. Asignar el ID del usuario al Request (para que el Service lo use)
        request.setIdUsuario(usuario.getId());

        try {
            // 3. Llamar al nuevo método del servicio que maneja el DTO
            Subcategoria nuevaSubcategoria = categoriaService.crearSubcategoria(request);
            return new ResponseEntity<>(nuevaSubcategoria, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (RuntimeException e) {
             return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
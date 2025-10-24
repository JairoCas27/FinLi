package com.finli.controller;

import com.finli.model.Categoria;
import com.finli.model.Subcategoria;
import com.finli.model.Usuario;
import com.finli.service.CategoriaService;
import com.finli.service.ServicioAutenticacion;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categorias")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CategoriaController {

    private final CategoriaService categoriaService;
    private final ServicioAutenticacion authService;

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
        Categoria categoria = categoriaService.obtenerCategoriasPorUsuario(usuario)
                .stream()
                .filter(c -> c.getIdCategoria().equals(id))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));
        return ResponseEntity.ok(categoriaService.obtenerSubcategoriasPorCategoriaYUsuario(categoria, usuario));
    }

    @PostMapping
    public ResponseEntity<Categoria> crear(@RequestBody Categoria categoria, @RequestParam String email) {
        Usuario usuario = authService.buscarPorCorreo(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        categoria.setUsuario(usuario);
        return ResponseEntity.ok(categoriaService.guardarCategoria(categoria));
    }

    @PostMapping("/subcategorias")
    public ResponseEntity<Subcategoria> crearSub(@RequestBody Subcategoria subcategoria, @RequestParam String email) {
        Usuario usuario = authService.buscarPorCorreo(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        subcategoria.setUsuario(usuario);
        return ResponseEntity.ok(categoriaService.guardarSubcategoria(subcategoria));
    }
}
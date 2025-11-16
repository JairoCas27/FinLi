package com.finli.service;

import com.finli.model.*;
import com.finli.dto.CrearCategoriaRequest;
import com.finli.dto.CrearSubcategoriaRequest;
import com.finli.repository.CategoriaRepository;
import com.finli.repository.SubcategoriaRepository;
import com.finli.repository.FuenteCategoriaRepository; // 1. Nuevo Import
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import com.google.common.base.Preconditions;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; // Mantenemos el import para otros métodos

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CategoriaService {

    private final CategoriaRepository categoriaRepo;
    private final SubcategoriaRepository subcategoriaRepo;
    private final FuenteCategoriaRepository fuenteCategoriaRepository; // 2. Nuevo Repositorio
    // private final UsuarioRepository usuarioRepository; // 3. Se asume que existe

    public List<Categoria> obtenerCategoriasPorUsuario(Usuario usuario) {
        return categoriaRepo.findByUsuario(usuario);
    }

    public List<Subcategoria> obtenerSubcategoriasPorCategoriaYUsuario(Categoria categoria, Usuario usuario) {
        return subcategoriaRepo.findByCategoriaAndUsuario(categoria, usuario);
    }
    
    // Método para listar todas las categorías (útil para el administrador)
    public List<Categoria> obtenerTodasLasCategorias() {
        return categoriaRepo.findAll();
    }
    
    // 💡 MÉTODO CRÍTICO ACTUALIZADO: Para obtener solo categorías base/globales
    // Se elimina el @Transactional y la lógica de bucle. ¡Usamos JOIN FETCH!
    public List<Categoria> obtenerCategoriasBase() {
        // Llama al método del repositorio que usa JOIN FETCH para cargar todo en 1 consulta.
        return categoriaRepo.findBaseCategoriesWithSubcategories(); 
    }

    public Optional<Categoria> buscarPorId(Integer id) {
        return categoriaRepo.findById(id);
    }
    
    // 4. Lógica para Crear una Categoría desde el DTO
    @Transactional
    public Categoria crearCategoria(CrearCategoriaRequest request) {
        if (StringUtils.isBlank(request.getNombreCategoria())) {
            throw new IllegalArgumentException("El nombre de la categoría no puede estar vacío");
        }
        
        Usuario usuario;
        if (request.getIdUsuario() == null) {
            throw new IllegalArgumentException("ID de Usuario requerido para la creación de categorías.");
        } else {
             usuario = new Usuario(); 
             usuario.setId(request.getIdUsuario()); 
        }

        FuenteCategoria fuentePersonal = fuenteCategoriaRepository.findByNombreFuente("Personal")
                .orElseThrow(() -> new RuntimeException("Fuente 'Personal' no encontrada en la base de datos."));
        
        Categoria nuevaCategoria = Categoria.builder()
                .nombreCategoria(request.getNombreCategoria())
                .fuente(fuentePersonal)
                .usuario(usuario) 
                .build();
                
        return this.guardarCategoria(nuevaCategoria);
    }


    // 5. Lógica para Crear una Subcategoría desde el DTO
    @Transactional
    public Subcategoria crearSubcategoria(CrearSubcategoriaRequest request) {
        if (StringUtils.isBlank(request.getNombreSubcategoria())) {
            throw new IllegalArgumentException("El nombre de la subcategoría no puede estar vacío");
        }

        Categoria categoriaPadre = categoriaRepo.findById(request.getIdCategoria())
                .orElseThrow(() -> new RuntimeException("Categoría padre no encontrada con ID: " + request.getIdCategoria()));

        Usuario usuario;
        if (request.getIdUsuario() == null) {
             throw new IllegalArgumentException("ID de Usuario requerido para la creación de subcategorías.");
        } else {
             usuario = new Usuario(); 
             usuario.setId(request.getIdUsuario()); 
        }

        Subcategoria nuevaSubcategoria = Subcategoria.builder()
                .nombreSubcategoria(request.getNombreSubcategoria())
                .categoria(categoriaPadre) 
                .usuario(usuario)
                .build();

        return this.guardarSubcategoria(nuevaSubcategoria);
    }
    
    // Método existente (se mantiene)
    @Transactional
    public Categoria guardarCategoria(Categoria categoria) {
        if (StringUtils.isBlank(categoria.getNombreCategoria())) {
            throw new IllegalArgumentException("El nombre de la categoría no puede estar vacío");
        }
        Preconditions.checkNotNull(categoria.getUsuario(), "Usuario requerido"); 
        return categoriaRepo.save(categoria);
    }

    // Método existente (se mantiene)
    @Transactional
    public Subcategoria guardarSubcategoria(Subcategoria subcategoria) {
        Preconditions.checkNotNull(subcategoria.getCategoria(), "Categoría requerida");
        Preconditions.checkNotNull(subcategoria.getUsuario(), "Usuario requerido"); 
        return subcategoriaRepo.save(subcategoria);
    }
}
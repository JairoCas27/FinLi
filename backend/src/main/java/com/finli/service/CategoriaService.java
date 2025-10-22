package com.finli.service;

import com.finli.model.Categoria;
import com.finli.model.Subcategoria;
import com.finli.model.Usuario;
import com.finli.repository.CategoriaRepository;
import com.finli.repository.SubcategoriaRepository;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import com.google.common.base.Preconditions;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoriaService {

    private final CategoriaRepository categoriaRepo;
    private final SubcategoriaRepository subcategoriaRepo;

    public List<Categoria> obtenerCategoriasPorUsuario(Usuario usuario) {
        return categoriaRepo.findByUsuario(usuario);
    }

    public List<Subcategoria> obtenerSubcategoriasPorCategoriaYUsuario(Categoria categoria, Usuario usuario) {
        return subcategoriaRepo.findByCategoriaAndUsuario(categoria, usuario);
    }

    public Categoria guardarCategoria(Categoria categoria) {
        if (StringUtils.isBlank(categoria.getNombreCategoria())) {
            throw new IllegalArgumentException("El nombre de la categoría no puede estar vacío");
        }
        Preconditions.checkNotNull(categoria.getUsuario(), "Usuario requerido");
        return categoriaRepo.save(categoria);
    }

    public Subcategoria guardarSubcategoria(Subcategoria subcategoria) {
        Preconditions.checkNotNull(subcategoria.getCategoria(), "Categoría requerida");
        Preconditions.checkNotNull(subcategoria.getUsuario(), "Usuario requerido");
        return subcategoriaRepo.save(subcategoria);
    }
}

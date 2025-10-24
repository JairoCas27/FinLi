package com.finli.repository;

import com.finli.model.Categoria;
import com.finli.model.Subcategoria;
import com.finli.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SubcategoriaRepository extends JpaRepository<Subcategoria, Integer> {
    List<Subcategoria> findByCategoriaAndUsuario(Categoria categoria, Usuario usuario);
}
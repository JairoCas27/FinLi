package com.finli.repository;

import com.finli.model.Categoria;
import com.finli.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CategoriaRepository extends JpaRepository<Categoria, Integer> {
    List<Categoria> findByUsuario(Usuario usuario);
     Optional<Categoria> findById(Integer id);
}
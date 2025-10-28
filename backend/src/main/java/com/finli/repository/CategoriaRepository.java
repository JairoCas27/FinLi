package com.finli.repository;

import com.finli.model.Categoria;
import com.finli.model.FuenteCategoria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoriaRepository extends JpaRepository<Categoria, Integer> {
    List<Categoria> findByFuente(FuenteCategoria fuente);
}

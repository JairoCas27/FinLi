package com.finli.repository;

import com.finli.model.FuenteCategoria;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface FuenteCategoriaRepository extends JpaRepository<FuenteCategoria, Integer> {
    Optional<FuenteCategoria> findByNombreFuente(String nombreFuente);
}
package com.finli.repository;

import com.finli.model.FuenteCategoria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FuenteCategoriaRepository extends JpaRepository<FuenteCategoria, Integer> {
}

package com.finli.repository;

import com.finli.model.TipoSuscripcion;
import org.springframework.data.jpa.repository.JpaRepository;

// El ID de TipoSuscripcion es Integer, por lo que hereda de JpaRepository<TipoSuscripcion, Integer>
public interface TipoSuscripcionRepository extends JpaRepository<TipoSuscripcion, Integer> {
    // JpaRepository proporciona todos los métodos CRUD básicos y de listado.
}
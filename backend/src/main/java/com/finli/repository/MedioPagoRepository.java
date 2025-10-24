package com.finli.repository;

import com.finli.model.MedioPago;
import com.finli.model.Usuario;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MedioPagoRepository extends JpaRepository<MedioPago, Integer> {
    List<MedioPago> findByUsuario(Usuario usuario);
}
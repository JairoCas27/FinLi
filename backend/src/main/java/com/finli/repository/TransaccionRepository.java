package com.finli.repository;

import com.finli.model.Transaccion;
import com.finli.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TransaccionRepository extends JpaRepository<Transaccion, Integer> {
    List<Transaccion> findByUsuarioAndFechaBetween(Usuario usuario, LocalDateTime inicio, LocalDateTime fin);

    List<Transaccion> findByUsuarioAndFechaHoraBetween(Usuario usuario, LocalDateTime inicio, LocalDateTime fin);
}
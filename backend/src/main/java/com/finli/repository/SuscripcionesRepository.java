package com.finli.repository;

import com.finli.model.Suscripciones;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

// El ID de Suscripciones es Integer, por lo que hereda de JpaRepository<Suscripciones, Integer>
public interface SuscripcionesRepository extends JpaRepository<Suscripciones, Integer> {
    
    /**
     * Busca la suscripción más reciente y ACTIVA (asumiendo que idEstadoSuscripcion = 1 es 'Activa')
     * para un usuario específico.
     * * @param idUsuario ID del usuario.
     * @return Un Optional que contiene la suscripción más reciente y activa, o vacío si no la encuentra.
     */
    @Query("SELECT s FROM Suscripciones s " +
           "WHERE s.usuario.id = :idUsuario " +
           "AND s.estadoSuscripcion.idEstadoSuscripcion = 1 " + // Asume ID 1 = ACTIVA
           "ORDER BY s.fechaInicio DESC LIMIT 1") // Limita a 1 para obtener la más reciente
    Optional<Suscripciones> findCurrentActiveSubscription(@Param("idUsuario") Integer idUsuario);
    
    /**
     * Alternativa: Busca la suscripción más reciente, independientemente del estado.
     * Usaremos este método si la suscripción de un usuario inactivo también debe mostrarse.
     * * @param idUsuario ID del usuario.
     * @return El registro de suscripción más reciente.
     */
    Optional<Suscripciones> findFirstByUsuario_IdOrderByFechaInicioDesc(Integer idUsuario);
}

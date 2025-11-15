package com.finli.repository;

import com.finli.model.Usuario;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query; // <-- NUEVA IMPORTACIÓN
import java.util.Optional;

// El ID del Usuario es Integer, por lo que hereda de JpaRepository<Usuario, Integer>
public interface UsuarioRepository extends JpaRepository<Usuario, Integer> { 
    
    Optional<Usuario> findByCorreo(String correo);
    boolean existsByCorreo(String correo);

    /**
     * Busca usuarios paginados por el ID del estado de usuario.
     * @param idEstado El ID del estado (e.g., 1=Activo, 2=Inactivo).
     * @param pageable Objeto de paginación y ordenamiento.
     * @return Una página de entidades Usuario (Page).
     */
    Page<Usuario> findByEstadoUsuario_IdEstado(Integer idEstado, Pageable pageable);

    // -----------------------------------------------------------------------------------
    // ------------------- NUEVOS MÉTODOS PARA BÚSQUEDA Y FILTRADO -----------------------
    // -----------------------------------------------------------------------------------
    
    /**
     * Consulta que filtra por estado Y por término de búsqueda en Nombre, Apellido y Correo.
     * Usa LOWER() y CONCAT('%', :searchTerm, '%') para hacer la búsqueda insensible a mayúsculas/minúsculas.
     * @param idEstado ID del estado de suscripción (ej: 1, 2).
     * @param searchTerm Término de búsqueda.
     * @param pageable Paginación.
     */
    @Query("SELECT u FROM Usuario u WHERE u.estadoUsuario.idEstado = :idEstado AND (" +
           "LOWER(u.nombre) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(u.apellidoPaterno) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(u.apellidoMaterno) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(u.correo) LIKE LOWER(CONCAT('%', :searchTerm, '%')))")
    Page<Usuario> findByEstadoAndSearch(Integer idEstado, String searchTerm, Pageable pageable);
    
    /**
     * Consulta que SOLO filtra por término de búsqueda en Nombre, Apellido y Correo (status="all").
     * @param searchTerm Término de búsqueda.
     * @param pageable Paginación.
     */
    @Query("SELECT u FROM Usuario u WHERE " +
           "LOWER(u.nombre) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(u.apellidoPaterno) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(u.apellidoMaterno) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(u.correo) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    Page<Usuario> findBySearchTerm(String searchTerm, Pageable pageable);
}
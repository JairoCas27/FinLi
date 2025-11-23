package com.finli.repository;

import com.finli.model.Usuario;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param; // <-- NUEVO: Importación necesaria para el filtro
import java.util.List;
import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {
    
    Optional<Usuario> findByCorreo(String correo);
    boolean existsByCorreo(String correo);

    Page<Usuario> findByEstadoUsuario_IdEstado(Integer idEstado, Pageable pageable);

    // --- NUEVO: Interfaz para capturar los datos crudos de la base de datos ---
    public interface UserAdminProjection {
        Integer getId();
        String getNombre();
        String getApellido();
        String getEmail();
        String getSuscripcion();
    }

    // --- MODIFICADO: Ahora acepta un parámetro :keyword para buscar por nombre o correo ---
    @Query(value = """
        SELECT 
            u.id AS id, 
            u.nombre AS nombre,
            u.apellido_Paterno AS apellido, 
            u.correo AS email,
            COALESCE(ts.nombre_tiposuscripcion, 'Sin suscripción') AS suscripcion
        FROM usuarios u
        LEFT JOIN suscripciones s ON u.id = s.id_usuario AND s.id_estadosuscripcion = 1
        LEFT JOIN tiposuscripcion ts ON s.id_tiposuscripcion = ts.id_tiposuscripcion
        WHERE 
            (:keyword IS NULL OR :keyword = '') OR 
            (LOWER(CONCAT(u.nombre, ' ', u.apellido_Paterno)) LIKE LOWER(CONCAT('%', :keyword, '%'))) OR 
            (LOWER(u.correo) LIKE LOWER(CONCAT('%', :keyword, '%')))
        """, nativeQuery = true)
    List<UserAdminProjection> obtenerDatosAdmin(@Param("keyword") String keyword);
}
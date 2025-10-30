package com.finli.repository;

import com.finli.model.Usuario;
import org.springframework.data.domain.Page;    // <-- NUEVA Importación: Para resultados paginados
import org.springframework.data.domain.Pageable; // <-- NUEVA Importación: Para la paginación
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {
    Optional<Usuario> findByCorreo(String correo);
    boolean existsByCorreo(String correo);

    // NUEVO MÉTODO PARA PAGINACIÓN Y FILTRADO:
    /**
     * Busca usuarios paginados por el ID del estado de usuario.
     * @param idEstado El ID del estado (e.g., 1=Activo, 2=Inactivo).
     * @param pageable Objeto de paginación y ordenamiento.
     * @return Una página de entidades Usuario (Page).
     */
    Page<Usuario> findByEstadoUsuario_IdEstado(Integer idEstado, Pageable pageable);
}
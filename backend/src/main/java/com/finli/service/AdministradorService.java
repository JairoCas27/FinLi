package com.finli.service;

import com.finli.dto.PaginacionUsuarioResponse;
import com.finli.dto.UsuarioResponse;
import com.finli.model.EstadoUsuario;
import com.finli.model.Usuario;
import com.finli.repository.EstadoUsuarioRepository;
import com.finli.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort; 
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils; // <-- NUEVA IMPORTACIÓN

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdministradorService {

    private final UsuarioRepository usuarioRepository;
    private final ServicioAutenticacion servicioAutenticacion;
    private final EstadoUsuarioRepository estadoUsuarioRepository;
    
    private final Integer ID_ESTADO_ACTIVO = 1; 
    private final Integer ID_ESTADO_INACTIVO = 2; 

    // ====================================================================================
    // === MÉTODO: LISTAR PAGINADO Y FILTRADO (CON BÚSQUEDA)
    // ====================================================================================

    /**
     * Obtiene una lista paginada, filtrada por estado y filtrada por término de búsqueda.
     * @param page Número de página (1-based).
     * @param limit Número de elementos por página.
     * @param status Filtro de estado ('all', 'active', 'inactive').
     * @param searchTerm Término de búsqueda (nombre, apellido o correo). <-- NUEVO PARÁMETRO
     * @return DTO con la lista de usuarios de la página y el conteo total.
     */
    public PaginacionUsuarioResponse getUsuariosPaginadosYFiltrados(int page, int limit, String status, String searchTerm) { // <-- MODIFICACIÓN EN LA FIRMA
        
        // Verifica si el término de búsqueda es válido y debe ser aplicado
        boolean isSearching = StringUtils.hasText(searchTerm);
        
        // Spring Data JPA usa paginación basada en 0, por eso restamos 1 a 'page'.
        Pageable pageable = PageRequest.of(
            page - 1, 
            limit, 
            Sort.by(Sort.Direction.DESC, "id")
        );
        
        Page<Usuario> paginaUsuarios;
        
        // Lógica de filtrado y búsqueda combinada
        if (isSearching) {
            // Caso 1: Hay término de búsqueda (usamos findByEstadoAndSearch/findBySearchTerm)
            if (status.equalsIgnoreCase("active")) {
                // Filtra por ACTIVO y BÚSQUEDA
                paginaUsuarios = usuarioRepository.findByEstadoAndSearch(ID_ESTADO_ACTIVO, searchTerm, pageable);
            } else if (status.equalsIgnoreCase("inactive")) {
                // Filtra por INACTIVO y BÚSQUEDA
                paginaUsuarios = usuarioRepository.findByEstadoAndSearch(ID_ESTADO_INACTIVO, searchTerm, pageable);
            } else {
                // Filtra por BÚSQUEDA SOLAMENTE (status="all")
                paginaUsuarios = usuarioRepository.findBySearchTerm(searchTerm, pageable);
            }

        } else {
            // Caso 2: No hay término de búsqueda (Lógica original de solo filtrado por estado)
            if (status.equalsIgnoreCase("active")) {
                paginaUsuarios = usuarioRepository.findByEstadoUsuario_IdEstado(ID_ESTADO_ACTIVO, pageable);
            } else if (status.equalsIgnoreCase("inactive")) {
                paginaUsuarios = usuarioRepository.findByEstadoUsuario_IdEstado(ID_ESTADO_INACTIVO, pageable);
            } else {
                // "all": Busca todos los usuarios sin filtro de estado ni búsqueda
                paginaUsuarios = usuarioRepository.findAll(pageable);
            }
        }

        // Mapear las entidades Usuario a los DTOs UsuarioResponse
        List<UsuarioResponse> listaResponse = paginaUsuarios.getContent().stream()
                .map(servicioAutenticacion::toResponse)
                .collect(Collectors.toList());

        // Construir y devolver el DTO de respuesta que espera el frontend
        return new PaginacionUsuarioResponse(
                listaResponse, 
                paginaUsuarios.getTotalElements()
        );
    }
    
    // ====================================================================================
    // === EL RESTO DE TUS MÉTODOS SE MANTIENEN IGUAL ===
    // ====================================================================================

    public List<Usuario> obtenerListaDeUsuariosParaExportar() {
        return usuarioRepository.findAll(Sort.by(Sort.Direction.DESC, "id")); 
    }

    public Usuario guardarCliente(Usuario usuario) {
        return usuarioRepository.save(usuario);
    }

    public List<EstadoUsuario> listarTodosEstadosUsuario() {
        return estadoUsuarioRepository.findAll();
    }

    @Transactional
    public Optional<Usuario> actualizarUsuario(Usuario usuarioConCambios) {
        return usuarioRepository.findById(usuarioConCambios.getId()).map(usuarioExistente -> {
            usuarioExistente.setNombre(usuarioConCambios.getNombre());
            usuarioExistente.setApellidoPaterno(usuarioConCambios.getApellidoPaterno());
            usuarioExistente.setApellidoMaterno(usuarioConCambios.getApellidoMaterno());
            usuarioExistente.setCorreo(usuarioConCambios.getCorreo());
            usuarioExistente.setEdad(usuarioConCambios.getEdad());

            if (usuarioConCambios.getEstadoUsuario() != null
                    && usuarioConCambios.getEstadoUsuario().getIdEstado() != null) {
                usuarioExistente.setEstadoUsuario(usuarioConCambios.getEstadoUsuario());
            }

            return usuarioRepository.save(usuarioExistente);
        });
    }

    public boolean eliminarUsuarioLogico(Integer id) {
        return usuarioRepository.findById(id).map(usuario -> {
            EstadoUsuario estadoInactivo = EstadoUsuario.builder()
                    .idEstado(ID_ESTADO_INACTIVO)
                    .build();

            usuario.setEstadoUsuario(estadoInactivo);

            usuarioRepository.save(usuario);
            return true;
        }).orElse(false);
    }
}

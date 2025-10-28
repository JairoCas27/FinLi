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
import org.springframework.data.domain.Sort; // <-- NUEVA IMPORTACIÓN PARA EL ORDEN
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdministradorService {

    private final UsuarioRepository usuarioRepository;
    private final ServicioAutenticacion servicioAutenticacion;
    private final EstadoUsuarioRepository estadoUsuarioRepository;
    
    // Asumimos que ID_ESTADO_ACTIVO es 1 (por defecto)
    private final Integer ID_ESTADO_ACTIVO = 1; 
    private final Integer ID_ESTADO_INACTIVO = 2; // El ID que ya tenías

    // ====================================================================================
    // === MÉTODO: LISTAR PAGINADO Y FILTRADO (CON ORDEN DESCENDENTE)
    // ====================================================================================

    /**
     * Obtiene una lista paginada y filtrada de usuarios, ordenada por ID descendente.
     * @param page Número de página (1-based).
     * @param limit Número de elementos por página.
     * @param status Filtro de estado ('all', 'active', 'inactive').
     * @return DTO con la lista de usuarios de la página y el conteo total.
     */
    public PaginacionUsuarioResponse getUsuariosPaginadosYFiltrados(int page, int limit, String status) {
        
        // Spring Data JPA usa paginación basada en 0, por eso restamos 1 a 'page'.
        // CAMBIO CLAVE: Incluir Sort.by(Sort.Direction.DESC, "id") para ordenar por el más reciente.
        Pageable pageable = PageRequest.of(
            page - 1, 
            limit, 
            Sort.by(Sort.Direction.DESC, "id") // <--- ORDEN DESCENDENTE POR ID
        );
        
        Page<Usuario> paginaUsuarios;
        
        // Lógica de filtrado
        if (status.equalsIgnoreCase("active")) {
            // Se asume que ID_ESTADO_ACTIVO = 1
            paginaUsuarios = usuarioRepository.findByEstadoUsuario_IdEstado(ID_ESTADO_ACTIVO, pageable);
        } else if (status.equalsIgnoreCase("inactive")) {
            // Se asume que ID_ESTADO_INACTIVO = 2
            paginaUsuarios = usuarioRepository.findByEstadoUsuario_IdEstado(ID_ESTADO_INACTIVO, pageable);
        } else {
            // "all": Busca todos los usuarios sin filtro de estado
            paginaUsuarios = usuarioRepository.findAll(pageable);
        }

        // Mapear las entidades Usuario a los DTOs UsuarioResponse usando el servicio que ya existe
        List<UsuarioResponse> listaResponse = paginaUsuarios.getContent().stream()
                .map(servicioAutenticacion::toResponse) // Usamos tu método existente
                .collect(Collectors.toList());

        // Construir y devolver el DTO de respuesta que espera el frontend
        return new PaginacionUsuarioResponse(
                listaResponse, 
                paginaUsuarios.getTotalElements() // totalCount
        );
    }
    
    // ====================================================================================
    // === EL RESTO DE TUS MÉTODOS SE MANTIENEN IGUAL ===
    // ====================================================================================

    // EXPORTACIÓN A EXCEL (Se mantiene)
    public List<Usuario> obtenerListaDeUsuariosParaExportar() {
        return usuarioRepository.findAll(Sort.by(Sort.Direction.DESC, "id")); // Opcional: ordenar la exportación también
    }

    // GUARDAR CLIENTE (Se mantiene)
    public Usuario guardarCliente(Usuario usuario) {
        return usuarioRepository.save(usuario);
    }

    // LISTAR ESTADOS (Se mantiene)
    public List<EstadoUsuario> listarTodosEstadosUsuario() {
        return estadoUsuarioRepository.findAll();
    }

    // ACTUALIZAR USUARIO (Se mantiene)
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

    // ELIMINACIÓN LÓGICA (Se mantiene)
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

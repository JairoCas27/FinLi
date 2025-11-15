package com.finli.service;

import com.finli.dto.PaginacionUsuarioResponse;
import com.finli.dto.UsuarioResponse;
import com.finli.dto.UsuarioResponse.SuscripcionActualResponse; 
import com.finli.model.EstadoSuscripcion; 
import com.finli.model.TipoSuscripcion; 
import com.finli.model.EstadoUsuario;
import com.finli.model.Suscripciones; 
import com.finli.model.Usuario;
import com.finli.repository.EstadoUsuarioRepository;
import com.finli.repository.SuscripcionesRepository; 
import com.finli.repository.TipoSuscripcionRepository;
import com.finli.repository.UsuarioRepository;
import com.finli.dto.UpdateUserRequest; // Necesario para la estructura del POST
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort; 
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils; 

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdministradorService {

    private final UsuarioRepository usuarioRepository;
    private final ServicioAutenticacion servicioAutenticacion; 
    private final EstadoUsuarioRepository estadoUsuarioRepository;
    private final SuscripcionesRepository suscripcionesRepository;
    private final TipoSuscripcionRepository tipoSuscripcionRepository; 
    // private final PasswordEncoder passwordEncoder; // <-- Descomentar si usas Spring Security
    
    private final Integer ID_ESTADO_ACTIVO = 1; 
    private final Integer ID_ESTADO_INACTIVO = 2; 
    private final Integer ID_ESTADO_SUSCRIPCION_ACTIVA = 1; // ID 1 de EstadoSuscripcion = 'Activa'

    // ====================================================================================
    // === MÉTODOS DE LISTADO Y MAPEO (Lectura) ===
    // ====================================================================================

    /**
     * Obtiene una lista paginada, filtrada por estado y filtrada por término de búsqueda.
     */
    public PaginacionUsuarioResponse getUsuariosPaginadosYFiltrados(int page, int limit, String status, String searchTerm) {
        
        boolean isSearching = StringUtils.hasText(searchTerm);
        
        Pageable pageable = PageRequest.of(
            page - 1, 
            limit, 
            Sort.by(Sort.Direction.DESC, "id")
        );
        
        Page<Usuario> paginaUsuarios;
        
        // Lógica de filtrado y búsqueda (se mantiene)
        if (isSearching) {
            if (status.equalsIgnoreCase("active")) {
                paginaUsuarios = usuarioRepository.findByEstadoAndSearch(ID_ESTADO_ACTIVO, searchTerm, pageable);
            } else if (status.equalsIgnoreCase("inactive")) {
                paginaUsuarios = usuarioRepository.findByEstadoAndSearch(ID_ESTADO_INACTIVO, searchTerm, pageable);
            } else {
                paginaUsuarios = usuarioRepository.findBySearchTerm(searchTerm, pageable);
            }
        } else {
            if (status.equalsIgnoreCase("active")) {
                paginaUsuarios = usuarioRepository.findByEstadoUsuario_IdEstado(ID_ESTADO_ACTIVO, pageable);
            } else if (status.equalsIgnoreCase("inactive")) {
                paginaUsuarios = usuarioRepository.findByEstadoUsuario_IdEstado(ID_ESTADO_INACTIVO, pageable);
            } else {
                paginaUsuarios = usuarioRepository.findAll(pageable);
            }
        }

        List<UsuarioResponse> listaResponse = paginaUsuarios.getContent().stream()
                .map(this::toUsuarioResponse)
                .collect(Collectors.toList());

        return new PaginacionUsuarioResponse(
                listaResponse, 
                paginaUsuarios.getTotalElements()
        );
    }
    
    /**
     * Mapea la entidad Usuario al DTO UsuarioResponse y añade la información de suscripción.
     */
    private UsuarioResponse toUsuarioResponse(Usuario usuario) {
        
        Optional<Suscripciones> suscripcionOpt = suscripcionesRepository.findFirstByUsuario_IdOrderByFechaInicioDesc(usuario.getId());
        
        SuscripcionActualResponse suscripcionDto = suscripcionOpt.map(suscripcion -> 
            SuscripcionActualResponse.builder()
                .idTipoSuscripcion(suscripcion.getTipoSuscripcion().getIdTipoSuscripcion())
                .nombreTipoSuscripcion(suscripcion.getTipoSuscripcion().getNombreTipoSuscripcion())
                .estadoSuscripcion(suscripcion.getEstadoSuscripcion().getNombreEstado())
                .fechaInicio(suscripcion.getFechaInicio())
                .build()
        ).orElseGet(() -> 
            SuscripcionActualResponse.builder()
                .idTipoSuscripcion(4) // Asume ID 4 es el plan 'Gratuito'
                .nombreTipoSuscripcion("Gratuito (No registrado)")
                .estadoSuscripcion("Inactivo")
                .fechaInicio(null)
                .build()
        );
        
        return UsuarioResponse.builder()
                .id(usuario.getId())
                .correo(usuario.getCorreo())
                .nombre(usuario.getNombre())
                .apellidoPaterno(usuario.getApellidoPaterno())
                .apellidoMaterno(usuario.getApellidoMaterno())
                .edad(usuario.getEdad())
                .fechaRegistro(usuario.getFechaRegistro() != null ? usuario.getFechaRegistro().toString() : null)
                .estadoUsuario(UsuarioResponse.EstadoUsuarioResponse.builder()
                        .idEstado(usuario.getEstadoUsuario().getIdEstado())
                        .nombreEstado(usuario.getEstadoUsuario().getNombreEstado())
                        .build())
                .suscripcionActual(suscripcionDto)
                .build();
    }

    // ====================================================================================
    // === MÉTODOS DE ESCRITURA (Creación y Edición) ===
    // ====================================================================================

    /**
     * Crea un nuevo usuario y su registro de suscripción inicial.
     */
    @Transactional
    public Usuario guardarCliente(Usuario usuarioAInsertar, Integer nuevoTipoSuscripcionId) {
        
        // 1. Guardar el usuario (Esto asigna el ID)
        Usuario usuarioGuardado = usuarioRepository.save(usuarioAInsertar);

        // 2. Crear el registro de suscripción inicial
        this.crearSuscripcionInicial(usuarioGuardado, nuevoTipoSuscripcionId);
        
        return usuarioGuardado;
    }


    /**
     * Actualiza todos los campos de un usuario, incluyendo la contraseña (opcional) 
     * y el tipo de suscripción.
     */
    @Transactional
    public Optional<Usuario> actualizarUsuario(Usuario usuarioConCambios, String nuevaContrasena, Integer nuevoTipoSuscripcionId) {
        return usuarioRepository.findById(usuarioConCambios.getId()).map(usuarioExistente -> {
            
            // 1. ACTUALIZACIÓN DE DATOS PERSONALES
            usuarioExistente.setNombre(usuarioConCambios.getNombre());
            usuarioExistente.setApellidoPaterno(usuarioConCambios.getApellidoPaterno());
            usuarioExistente.setApellidoMaterno(usuarioConCambios.getApellidoMaterno());
            usuarioExistente.setCorreo(usuarioConCambios.getCorreo());
            usuarioExistente.setEdad(usuarioConCambios.getEdad());

            // 2. ACTUALIZACIÓN DEL ESTADO DE USUARIO (Activo/Inactivo)
            if (usuarioConCambios.getEstadoUsuario() != null && usuarioConCambios.getEstadoUsuario().getIdEstado() != null) {
                usuarioExistente.setEstadoUsuario(usuarioConCambios.getEstadoUsuario());
            }
            
            // 3. ACTUALIZACIÓN DE CONTRASEÑA (Solo si se proporciona una nueva)
            if (StringUtils.hasText(nuevaContrasena)) {
                // usuarioExistente.setContrasena(passwordEncoder.encode(nuevaContrasena)); // USAR SI HAY ENCODER
                usuarioExistente.setContrasena(nuevaContrasena); 
                System.out.println("ADVERTENCIA: Contraseña actualizada sin hashear en AdministradorService.java.");
            }
            
            // 4. ACTUALIZACIÓN DEL TIPO DE SUSCRIPCIÓN (Lógica de Creación de nuevo registro)
            this.actualizarOSetearSuscripcion(usuarioExistente, nuevoTipoSuscripcionId);

            // 5. Guardar los cambios en la entidad Usuario (datos personales y estado)
            return usuarioRepository.save(usuarioExistente);
        });
    }

    /**
     * Crea el registro de suscripción inicial para un nuevo usuario.
     */
    private void crearSuscripcionInicial(Usuario usuario, Integer nuevoTipoSuscripcionId) {
         if (nuevoTipoSuscripcionId == null) return;
         this.actualizarOSetearSuscripcion(usuario, nuevoTipoSuscripcionId);
    }


    /**
     * Compara y actualiza la suscripción del usuario creando un nuevo registro si el plan cambia.
     */
    private void actualizarOSetearSuscripcion(Usuario usuario, Integer nuevoTipoSuscripcionId) {
        if (nuevoTipoSuscripcionId == null) return; 

        // 1. Obtener la suscripción actual (la más reciente)
        Optional<Suscripciones> suscripcionRecienteOpt = suscripcionesRepository.findFirstByUsuario_IdOrderByFechaInicioDesc(usuario.getId());

        // 2. Determinar si es necesario un cambio (incluyendo el caso de que no haya suscripción aún)
        boolean necesitaCambio = true;
        
        if (suscripcionRecienteOpt.isPresent()) {
            Suscripciones reciente = suscripcionRecienteOpt.get();
            // Si el ID del plan seleccionado es IGUAL al ID del plan más reciente, no hay cambio.
            if (reciente.getTipoSuscripcion().getIdTipoSuscripcion().equals(nuevoTipoSuscripcionId)) {
                necesitaCambio = false;
            }
        }
        
        if (necesitaCambio) {
            // 3. Crear nuevo registro de suscripción
            TipoSuscripcion nuevoPlan = tipoSuscripcionRepository.findById(nuevoTipoSuscripcionId)
                    .orElseThrow(() -> new IllegalArgumentException("ID de TipoSuscripcion no válido: " + nuevoTipoSuscripcionId));

            // Creamos un nuevo registro de suscripción
            Suscripciones nuevaSuscripcion = Suscripciones.builder()
                .usuario(usuario)
                .tipoSuscripcion(nuevoPlan)
                .estadoSuscripcion(EstadoSuscripcion.builder().idEstadoSuscripcion(ID_ESTADO_SUSCRIPCION_ACTIVA).build()) // Asume Activa
                .fechaInicio(LocalDate.now())
                .fechaFin(null) // La fecha fin se establecería en base a la lógica de negocio (ej: +1 año)
                .build();
                
            suscripcionesRepository.save(nuevaSuscripcion);
        }
    }


    // ====================================================================================
    // === OTROS MÉTODOS ===
    // ====================================================================================

    public List<Usuario> obtenerListaDeUsuariosParaExportar() {
        return usuarioRepository.findAll(Sort.by(Sort.Direction.DESC, "id")); 
    }

    public List<EstadoUsuario> listarTodosEstadosUsuario() {
        return estadoUsuarioRepository.findAll();
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

package com.finli.service;

import com.finli.dto.PaginacionUsuarioResponse;
import com.finli.dto.UsuarioResponse;
import com.finli.dto.UsuarioResponse.SuscripcionActualResponse; 
import com.finli.model.EstadoSuscripcion; // <-- NUEVA IMPORTACIÓN
import com.finli.model.TipoSuscripcion;   // <-- NUEVA IMPORTACIÓN
import com.finli.model.EstadoUsuario;
import com.finli.model.Suscripciones; 
import com.finli.model.Usuario;
import com.finli.repository.EstadoUsuarioRepository;
import com.finli.repository.SuscripcionesRepository; 
import com.finli.repository.UsuarioRepository;
import com.finli.repository.TipoSuscripcionRepository; // <-- NUEVA INYECCIÓN
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort; 
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils; 

import java.time.LocalDate; // Para manejar fechas de suscripción
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdministradorService {

    private final UsuarioRepository usuarioRepository;
    private final ServicioAutenticacion servicioAutenticacion; // Mantenido, aunque no usado directamente en los métodos que refactorizamos
    private final EstadoUsuarioRepository estadoUsuarioRepository;
    private final SuscripcionesRepository suscripcionesRepository;
    private final TipoSuscripcionRepository tipoSuscripcionRepository; // <-- NUEVA INYECCIÓN
    // private final PasswordEncoder passwordEncoder; // <-- Pendiente si necesitas hashear
    
    private final Integer ID_ESTADO_ACTIVO = 1; 
    private final Integer ID_ESTADO_INACTIVO = 2; 
    private final Integer ID_ESTADO_SUSCRIPCION_ACTIVA = 1; // ID 1 de EstadoSuscripcion = 'Activa'

    // ====================================================================================
    // === MÉTODO: LISTAR PAGINADO Y FILTRADO (CON BÚSQUEDA Y SUSCRIPCIÓN)
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

        // Mapear las entidades Usuario a los DTOs UsuarioResponse usando el nuevo método local
        List<UsuarioResponse> listaResponse = paginaUsuarios.getContent().stream()
                .map(this::toUsuarioResponse)
                .collect(Collectors.toList());

        return new PaginacionUsuarioResponse(
                listaResponse, 
                paginaUsuarios.getTotalElements()
        );
    }
    
    // ====================================================================================
    // === NUEVO MÉTODO DE MAPEO DE ENTIDAD A DTO (Inclusión de Suscripción) ===
    // ====================================================================================
    
    /**
     * Mapea la entidad Usuario al DTO UsuarioResponse y añade la información de suscripción.
     */
    private UsuarioResponse toUsuarioResponse(Usuario usuario) {
        
        // 1. Obtener la suscripción más reciente para el usuario (independiente del estado).
        Optional<Suscripciones> suscripcionOpt = suscripcionesRepository.findFirstByUsuario_IdOrderByFechaInicioDesc(usuario.getId());
        
        // 2. Mapear la información de suscripción para el DTO.
        SuscripcionActualResponse suscripcionDto = suscripcionOpt.map(suscripcion -> 
            SuscripcionActualResponse.builder()
                .idTipoSuscripcion(suscripcion.getTipoSuscripcion().getIdTipoSuscripcion())
                .nombreTipoSuscripcion(suscripcion.getTipoSuscripcion().getNombreTipoSuscripcion())
                .estadoSuscripcion(suscripcion.getEstadoSuscripcion().getNombreEstado())
                .fechaInicio(suscripcion.getFechaInicio())
                .build()
        ).orElseGet(() -> 
            // Si no hay suscripción, asume el plan por defecto (Gratuito, ID 4 de tu BD)
            SuscripcionActualResponse.builder()
                .idTipoSuscripcion(4) 
                .nombreTipoSuscripcion("Gratuito (No registrado)")
                .estadoSuscripcion("Inactivo")
                .fechaInicio(null)
                .build()
        );
        
        // 3. Mapear el resto de los datos del usuario.
        return UsuarioResponse.builder()
                .id(usuario.getId())
                .correo(usuario.getCorreo())
                .nombre(usuario.getNombre())
                .apellidoPaterno(usuario.getApellidoPaterno())
                .apellidoMaterno(usuario.getApellidoMaterno())
                .edad(usuario.getEdad())
                .fechaRegistro(usuario.getFechaRegistro() != null ? usuario.getFechaRegistro().toString() : null)
                // Mapeo del estado Activo/Inactivo
                .estadoUsuario(UsuarioResponse.EstadoUsuarioResponse.builder()
                        .idEstado(usuario.getEstadoUsuario().getIdEstado())
                        .nombreEstado(usuario.getEstadoUsuario().getNombreEstado())
                        .build())
                // Añadir la suscripción mapeada
                .suscripcionActual(suscripcionDto)
                .build();
    }
    
    // ====================================================================================
    // === MÉTODO: ACTUALIZAR USUARIO (COMPLETAMENTE MODIFICADO) ===
    // ====================================================================================
    
    /**
     * Actualiza todos los campos de un usuario, incluyendo la contraseña (opcional) 
     * y el tipo de suscripción.
     * * @param usuarioConCambios Entidad con datos personales y estado de usuario.
     * @param nuevaContrasena La nueva contraseña (o null/vacia si no se cambia).
     * @param nuevoTipoSuscripcionId El ID del nuevo plan de suscripción.
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
            // No actualizamos la fecha de registro (es de solo lectura)

            // 2. ACTUALIZACIÓN DEL ESTADO DE USUARIO (Activo/Inactivo)
            if (usuarioConCambios.getEstadoUsuario() != null && usuarioConCambios.getEstadoUsuario().getIdEstado() != null) {
                usuarioExistente.setEstadoUsuario(usuarioConCambios.getEstadoUsuario());
            }
            
            // 3. ACTUALIZACIÓN DE CONTRASEÑA (Solo si se proporciona una nueva)
            if (StringUtils.hasText(nuevaContrasena)) {
                // ADVERTENCIA: La contraseña se guarda sin hashear. 
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
     * Compara y actualiza la suscripción del usuario creando un nuevo registro si el plan cambia.
     */
    private void actualizarOSetearSuscripcion(Usuario usuario, Integer nuevoTipoSuscripcionId) {
        if (nuevoTipoSuscripcionId == null) return; // No hay cambio de suscripción

        // 1. Obtener la suscripción actual (la más reciente)
        Optional<Suscripciones> suscripcionRecienteOpt = suscripcionesRepository.findFirstByUsuario_IdOrderByFechaInicioDesc(usuario.getId());

        // 2. Determinar si es necesario un cambio
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

            // Buscamos la nueva entidad TipoSuscripcion
            TipoSuscripcion nuevoPlan = tipoSuscripcionRepository.findById(nuevoTipoSuscripcionId)
                                            .orElseThrow(() -> new IllegalArgumentException("ID de TipoSuscripcion no válido: " + nuevoTipoSuscripcionId));

            // Creamos un nuevo registro de suscripción
            Suscripciones nuevaSuscripcion = Suscripciones.builder()
                .usuario(usuario)
                .tipoSuscripcion(nuevoPlan)
                .estadoSuscripcion(EstadoSuscripcion.builder().idEstadoSuscripcion(ID_ESTADO_SUSCRIPCION_ACTIVA).build()) // Asume Activa
                .fechaInicio(LocalDate.now())
                .fechaFin(null) // Para planes anuales o mensuales, aquí pondrías la fecha fin calculada
                .build();
                
            suscripcionesRepository.save(nuevaSuscripcion);
        }
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

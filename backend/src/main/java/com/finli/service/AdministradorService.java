package com.finli.service;

import com.finli.dto.CategoriaDTO;
import com.finli.dto.SubcategoriaDTO; // <-- IMPORTANTE: Nuevo DTO
import com.finli.dto.PaginacionUsuarioResponse;
import com.finli.dto.UserCreateDTO; 
import com.finli.dto.UserDetailDTO; 
import com.finli.dto.UsuarioResponse;
import com.finli.model.Categoria; // <-- IMPORTANTE: Nuevo Modelo
import com.finli.model.EstadoSuscripcion; 
import com.finli.model.EstadoUsuario;
import com.finli.model.Suscripcion; 
import com.finli.model.TipoSuscripcion; 
import com.finli.model.Usuario;
import com.finli.repository.CategoriaRepository; 
import com.finli.repository.EstadoSuscripcionRepository; 
import com.finli.repository.EstadoUsuarioRepository;
import com.finli.repository.SuscripcionRepository; 
import com.finli.repository.TipoSuscripcionRepository; 
import com.finli.repository.UsuarioRepository;
import com.finli.repository.SubcategoriaRepository; // <-- NUEVO REPOSITORIO
import lombok.RequiredArgsConstructor;
import org.mindrot.jbcrypt.BCrypt; 
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
    
    // --- REPOSITORIOS INYECTADOS ---
    private final SuscripcionRepository suscripcionRepository;
    private final TipoSuscripcionRepository tipoSuscripcionRepository;
    private final EstadoSuscripcionRepository estadoSuscripcionRepository;
    private final CategoriaRepository categoriaRepository;
    private final SubcategoriaRepository subcategoriaRepository; // <-- NUEVO REPOSITORIO

    private final Integer ID_ESTADO_ACTIVO = 1; 
    private final Integer ID_ESTADO_INACTIVO = 2; 

    // ====================================================================================
    // === GESTIÓN DE CATEGORÍAS Y SUBCATEGORÍAS ===
    // ====================================================================================

    @Transactional(readOnly = true)
    public List<CategoriaDTO> listarCategoriasPredeterminadas() {
        // 1. Obtenemos los datos crudos de la DB (id, nombre, cantidad)
        List<CategoriaRepository.CategoriaProjection> proyecciones = categoriaRepository.obtenerCategoriasPredeterminadasConConteo();

        // 2. Convertimos a DTO y asignamos estilos visuales
        return proyecciones.stream().map(proj -> {
            CategoriaDTO dto = new CategoriaDTO();
            dto.setId(proj.getId());
            dto.setLabel(proj.getNombre());
            dto.setSubcategoriesCount(proj.getCantidadSubcategorias());
            
            // Asignar icono y color basado en el nombre (Lógica visual)
            asignarEstiloCategoria(dto);
            
            return dto;
        }).collect(Collectors.toList());
    }

    // --- NUEVO MÉTODO: LISTAR SUBCATEGORÍAS POR CATEGORÍA ---
    @Transactional(readOnly = true)
    public List<SubcategoriaDTO> obtenerSubcategoriasPorCategoria(Integer categoriaId) {
        // 1. Buscar la entidad Categoria
        Categoria categoria = categoriaRepository.findById(categoriaId)
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada con ID: " + categoriaId));
        
        // 2. Obtener la lista de Subcategorías
        List<com.finli.model.Subcategoria> subcategorias = subcategoriaRepository.findByCategoria(categoria);
        
        // 3. Convertir a DTO y asignar estilos
        return subcategorias.stream().map(sub -> {
            SubcategoriaDTO dto = new SubcategoriaDTO();
            dto.setId(sub.getIdSubcategoria());
            dto.setLabel(sub.getNombreSubcategoria());
            dto.setName(sub.getNombreSubcategoria().toLowerCase().replaceAll("\\s+", "_")); // Generamos el nombre técnico (name)
            dto.setCategoriaId(categoriaId);
            
            // Asignar icono visual (Como no está en DB, lo asignamos por nombre)
            asignarIconoSubcategoria(dto);
            
            return dto;
        }).collect(Collectors.toList());
    }

    // Método auxiliar para definir la estética de las Categorías
    private void asignarEstiloCategoria(CategoriaDTO dto) {
        String nombre = dto.getLabel().toLowerCase();

        if (nombre.contains("vivienda")) {
            dto.setIcon("bi-house");
            dto.setColor("success"); 
        } else if (nombre.contains("transporte")) {
            dto.setIcon("bi-car-front");
            dto.setColor("primary"); 
        } else if (nombre.contains("alimentacion") || nombre.contains("alimentación")) {
            dto.setIcon("bi-cup-straw");
            dto.setColor("warning"); 
        } else if (nombre.contains("salud") || nombre.contains("cuidado")) {
            dto.setIcon("bi-heart-pulse");
            dto.setColor("danger"); 
        } else if (nombre.contains("entretenimiento") || nombre.contains("ocio")) {
            dto.setIcon("bi-controller");
            dto.setColor("info"); 
        } else if (nombre.contains("ropa")) {
            dto.setIcon("bi-bag");
            dto.setColor("secondary"); 
        } else if (nombre.contains("electrónica") || nombre.contains("electronica")) {
            dto.setIcon("bi-phone");
            dto.setColor("success");
        } else if (nombre.contains("hogar")) {
            dto.setIcon("bi-lamp");
            dto.setColor("primary");
        } else if (nombre.contains("educación") || nombre.contains("educacion")) {
            dto.setIcon("bi-book");
            dto.setColor("warning");
        } else {
            dto.setIcon("bi-tag");
            dto.setColor("secondary");
        }
    }
    
    // Método auxiliar para definir el icono de las Subcategorías
    private void asignarIconoSubcategoria(SubcategoriaDTO dto) {
        String nombre = dto.getLabel().toLowerCase();

        if (nombre.contains("alquiler") || nombre.contains("hipoteca")) {
            dto.setIcon("bi-building");
        } else if (nombre.contains("seguro")) {
            dto.setIcon("bi-shield-check");
        } else if (nombre.contains("internet") || nombre.contains("telefono") || nombre.contains("servicios")) {
            dto.setIcon("bi-wifi");
        } else if (nombre.contains("gasolina") || nombre.contains("combustible") || nombre.contains("peaje")) {
            dto.setIcon("bi-fuel-pump");
        } else if (nombre.contains("mantenimiento") || nombre.contains("reparaciones")) {
            dto.setIcon("bi-tools");
        } else if (nombre.contains("gimnasio") || nombre.contains("deporte")) {
            dto.setIcon("bi-person-running");
        } else {
            dto.setIcon("bi-tag"); // Default
        }
    }

    // ====================================================================================
    // === MÉTODOS DE USUARIO (MANTENIDOS) ===
    // ====================================================================================
    
    @Transactional
    public Usuario crearUsuarioConSuscripcion(UserCreateDTO dto) {
        
        if (usuarioRepository.existsByCorreo(dto.getEmail())) {
            throw new RuntimeException("El correo " + dto.getEmail() + " ya está registrado.");
        }

        EstadoUsuario estadoUsuarioActivo = estadoUsuarioRepository.findById(ID_ESTADO_ACTIVO)
                .orElseThrow(() -> new RuntimeException("Error: Estado de usuario 'Activo' no encontrado."));

        Usuario nuevoUsuario = new Usuario();
        nuevoUsuario.setNombre(dto.getNombre());
        nuevoUsuario.setApellidoPaterno(dto.getApellidoPaterno());
        nuevoUsuario.setApellidoMaterno(dto.getApellidoMaterno());
        nuevoUsuario.setEdad(dto.getEdad());
        nuevoUsuario.setCorreo(dto.getEmail());
        
        String hashPassword = BCrypt.hashpw(dto.getPassword(), BCrypt.gensalt());
        nuevoUsuario.setContrasena(hashPassword);
        
        nuevoUsuario.setRol(dto.getRol());
        nuevoUsuario.setEstadoUsuario(estadoUsuarioActivo);

        Usuario usuarioGuardado = usuarioRepository.save(nuevoUsuario);

        // Configurar Suscripción
        TipoSuscripcion tipo = tipoSuscripcionRepository.findById(dto.getSubscriptionId())
                .orElseThrow(() -> new RuntimeException("Tipo de suscripción no válido."));

        EstadoSuscripcion estadoSusActiva = estadoSuscripcionRepository.findById(1)
                .orElseThrow(() -> new RuntimeException("Estado de suscripción 'Activa' no encontrado."));

        Suscripcion suscripcion = new Suscripcion();
        suscripcion.setUsuario(usuarioGuardado);
        suscripcion.setTipoSuscripcion(tipo);
        suscripcion.setEstadoSuscripcion(estadoSusActiva);
        suscripcion.setFechaInicio(LocalDate.now());

        if (dto.getSubscriptionId() == 1) { 
            suscripcion.setFechaFin(LocalDate.now().plusMonths(1));
        } else if (dto.getSubscriptionId() == 2) { 
            suscripcion.setFechaFin(LocalDate.now().plusYears(1));
        } else {
            suscripcion.setFechaFin(null);
        }

        suscripcionRepository.save(suscripcion);

        return usuarioGuardado;
    }

    @Transactional(readOnly = true) 
    public UserDetailDTO obtenerUsuarioParaEditar(Integer id) {
        Usuario u = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Integer subId = 4; 
        if (u.getSuscripciones() != null) {
            subId = u.getSuscripciones().stream()
                    .filter(s -> s.getEstadoSuscripcion().getIdEstadoSuscripcion() == 1) 
                    .map(s -> s.getTipoSuscripcion().getIdTipoSuscripcion()) 
                    .findFirst()
                    .orElse(4);
        }

        return new UserDetailDTO(
            u.getId(),
            u.getNombre(),
            u.getApellidoPaterno(),
            u.getApellidoMaterno(),
            u.getEdad(),
            u.getCorreo(),
            u.getRol(),
            subId
        );
    }

    @Transactional
    public Usuario actualizarUsuarioDesdeAdmin(Integer id, UserCreateDTO dto) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (!usuario.getCorreo().equalsIgnoreCase(dto.getEmail()) && 
            usuarioRepository.existsByCorreo(dto.getEmail())) {
            throw new RuntimeException("El correo ya está en uso por otro usuario.");
        }

        usuario.setNombre(dto.getNombre());
        usuario.setApellidoPaterno(dto.getApellidoPaterno());
        usuario.setApellidoMaterno(dto.getApellidoMaterno());
        usuario.setEdad(dto.getEdad());
        usuario.setCorreo(dto.getEmail());
        usuario.setRol(dto.getRol());

        if (dto.getPassword() != null && !dto.getPassword().trim().isEmpty()) {
            String hashPassword = BCrypt.hashpw(dto.getPassword(), BCrypt.gensalt());
            usuario.setContrasena(hashPassword);
        }
        
        // --- ACTUALIZAR SUSCRIPCIÓN ---
        if (dto.getSubscriptionId() != null) {
            Suscripcion subActiva = null;
            if (usuario.getSuscripciones() != null) {
                subActiva = usuario.getSuscripciones().stream()
                    .filter(s -> s.getEstadoSuscripcion().getIdEstadoSuscripcion() == 1) // 1 = Activa
                    .findFirst()
                    .orElse(null);
            }

            if (subActiva == null || !subActiva.getTipoSuscripcion().getIdTipoSuscripcion().equals(dto.getSubscriptionId())) {
                
                TipoSuscripcion nuevoTipo = tipoSuscripcionRepository.findById(dto.getSubscriptionId())
                        .orElseThrow(() -> new RuntimeException("Tipo de suscripción inválido"));

                if (subActiva == null) {
                    subActiva = new Suscripcion();
                    subActiva.setUsuario(usuario);
                    subActiva.setEstadoSuscripcion(estadoSuscripcionRepository.findById(1).orElseThrow());
                    subActiva.setFechaInicio(LocalDate.now());
                } else {
                    subActiva.setFechaInicio(LocalDate.now());
                }

                subActiva.setTipoSuscripcion(nuevoTipo);

                if (dto.getSubscriptionId() == 1) { // Mensual
                    subActiva.setFechaFin(LocalDate.now().plusMonths(1));
                } else if (dto.getSubscriptionId() == 2) { // Anual
                    subActiva.setFechaFin(LocalDate.now().plusYears(1));
                } else {
                    subActiva.setFechaFin(null); // De por vida / Gratuito
                }

                suscripcionRepository.save(subActiva);
            }
        }
        
        return usuarioRepository.save(usuario);
    }

    @Transactional(readOnly = true)
    public PaginacionUsuarioResponse getUsuariosPaginadosYFiltrados(int page, int limit, String status) {
        Pageable pageable = PageRequest.of(page - 1, limit, Sort.by(Sort.Direction.DESC, "id"));
        Page<Usuario> paginaUsuarios;
        
        if (status.equalsIgnoreCase("active")) {
            paginaUsuarios = usuarioRepository.findByEstadoUsuario_IdEstado(ID_ESTADO_ACTIVO, pageable);
        } else if (status.equalsIgnoreCase("inactive")) {
            paginaUsuarios = usuarioRepository.findByEstadoUsuario_IdEstado(ID_ESTADO_INACTIVO, pageable);
        } else {
            paginaUsuarios = usuarioRepository.findAll(pageable);
        }

        List<UsuarioResponse> listaResponse = paginaUsuarios.getContent().stream()
                .map(servicioAutenticacion::toResponse)
                .collect(Collectors.toList());

        return new PaginacionUsuarioResponse(listaResponse, paginaUsuarios.getTotalElements());
    }
    
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

            if (usuarioConCambios.getEstadoUsuario() != null && usuarioConCambios.getEstadoUsuario().getIdEstado() != null) {
                usuarioExistente.setEstadoUsuario(usuarioConCambios.getEstadoUsuario());
            }
            return usuarioRepository.save(usuarioExistente);
        });
    }

    public boolean eliminarUsuarioLogico(Integer id) {
        return usuarioRepository.findById(id).map(usuario -> {
            EstadoUsuario estadoInactivo = EstadoUsuario.builder().idEstado(ID_ESTADO_INACTIVO).build();
            usuario.setEstadoUsuario(estadoInactivo);
            usuarioRepository.save(usuario);
            return true;
        }).orElse(false);
    }
}

package com.finli.service;

import com.finli.dto.CategoriaDTO;
import com.finli.dto.SubcategoriaDTO; 
import com.finli.dto.PaginacionUsuarioResponse;
import com.finli.dto.UserCreateDTO; 
import com.finli.dto.UserDetailDTO; 
import com.finli.dto.UsuarioResponse;
import com.finli.dto.MedioPagoDTO; 
import com.finli.model.Categoria; 
import com.finli.model.EstadoSuscripcion; 
import com.finli.model.EstadoUsuario;
import com.finli.model.FuenteCategoria;
import com.finli.model.MedioPago;
import com.finli.model.Subcategoria;
import com.finli.model.Suscripcion; 
import com.finli.model.TipoSuscripcion; 
import com.finli.model.Usuario;
import com.finli.repository.CategoriaRepository; 
import com.finli.repository.EstadoSuscripcionRepository; 
import com.finli.repository.EstadoUsuarioRepository;
import com.finli.repository.FuenteCategoriaRepository;
import com.finli.repository.MedioPagoRepository; 
import com.finli.repository.SuscripcionRepository; 
import com.finli.repository.TipoSuscripcionRepository; 
import com.finli.repository.UsuarioRepository;
import com.finli.repository.SubcategoriaRepository; 
import lombok.RequiredArgsConstructor;
import org.mindrot.jbcrypt.BCrypt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.extern.slf4j.Slf4j;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;


@Slf4j
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
    private final SubcategoriaRepository subcategoriaRepository; 
    private final MedioPagoRepository medioPagoRepository; // <-- AHORA INYECTADO
    
    private final Integer ID_ESTADO_ACTIVO = 1; 
    private final Integer ID_ESTADO_INACTIVO = 2; 
    
    // ⬇️⬇️  AGREGAMOS ESTA LÍNEA  ⬇️⬇️
    @Autowired
    private final FuenteCategoriaRepository fuenteCategoriaRepository; // ✅ nombre real
    // ====================================================================================
    // === GESTIÓN DE CATEGORÍAS, SUBCATEGORÍAS y MEDIOS DE PAGO ===
    // ====================================================================================

    @Transactional(readOnly = true)
    public List<CategoriaDTO> listarCategoriasPredeterminadas() {
        List<CategoriaRepository.CategoriaProjection> proyecciones = categoriaRepository.obtenerCategoriasPredeterminadasConConteo();

        return proyecciones.stream().map(proj -> {
            CategoriaDTO dto = new CategoriaDTO();
            dto.setId(proj.getId());
            dto.setLabel(proj.getNombre());
            dto.setSubcategoriesCount(proj.getCantidadSubcategorias());
            
            asignarEstiloCategoria(dto);
            
            return dto;
        }).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<SubcategoriaDTO> obtenerSubcategoriasPorCategoria(Integer categoriaId) {
        Categoria categoria = categoriaRepository.findById(categoriaId)
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada con ID: " + categoriaId));
        
        List<com.finli.model.Subcategoria> subcategorias = subcategoriaRepository.findByCategoria(categoria);
        
        return subcategorias.stream().map(sub -> {
            SubcategoriaDTO dto = new SubcategoriaDTO();
            dto.setId(sub.getIdSubcategoria());
            dto.setLabel(sub.getNombreSubcategoria());
            dto.setName(sub.getNombreSubcategoria().toLowerCase().replaceAll("\\s+", "_")); 
            dto.setCategoriaId(categoriaId);
            
            asignarIconoSubcategoria(dto);
            
            return dto;
        }).collect(Collectors.toList());
    }
    // --- NUEVO MÉTODO: LISTAR MEDIOS DE PAGO PREDETERMINADOS ---
    @Transactional(readOnly = true)
    public List<MedioPagoDTO> loadDefaultPaymentMethods() {
        // Filtramos por Usuario=NULL, ya que son los predeterminados del sistema
        List<MedioPago> mediosPago = medioPagoRepository.findByUsuario(null);
        
        return mediosPago.stream().map(mp -> {
            MedioPagoDTO dto = new MedioPagoDTO();
            dto.setId(mp.getIdMedioPago());
            dto.setName(mp.getNombreMedioPago());
            
            // Asignar el icono o logo (lógica visual)
            asignarLogoMedioPago(dto);

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
    
    // --- NUEVO: Método auxiliar para definir el icono del Medio de Pago ---
    private void asignarLogoMedioPago(MedioPagoDTO dto) {
        String nombre = dto.getName().toLowerCase();

        if (nombre.contains("efectivo")) {
            dto.setLogo("bi-cash-coin");
        } else if (nombre.contains("yape")) {
            dto.setLogo("bi-qr-code");
        } else if (nombre.contains("plin")) {
            dto.setLogo("bi-phone");
        } else if (nombre.contains("paypal")) {
            dto.setLogo("bi-paypal");
        } else if (nombre.contains("bcp")) {
            dto.setLogo("bi-bank");
        } else if (nombre.contains("bbva")) {
            dto.setLogo("bi-credit-card-2-front");
        } else if (nombre.contains("crédito") || nombre.contains("credito")) {
            dto.setLogo("bi-credit-card");
        } else if (nombre.contains("débito") || nombre.contains("debito")) {
            dto.setLogo("bi-credit-card-fill");
        } else {
            dto.setLogo("bi-currency-exchange");
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
        nuevoUsuario.setFechaRegistro(LocalDate.now()); // ✅ fecha real

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

    @Transactional
public MedioPagoDTO crearMedioPagoPredeterminado(MedioPagoDTO dto) {
    // Guardamos como predeterminado (usuario = null)
    MedioPago mp = MedioPago.builder()
            .nombreMedioPago(dto.getName())
            .montoInicial(0.0)          // valor inicial 0 para el sistema
            .fechaCreacion(LocalDateTime.now())
            .usuario(null)               // predeterminado
            .build();

    mp = medioPagoRepository.save(mp);

    // Devolvemos el DTO con el id asignado
    return new MedioPagoDTO(mp.getIdMedioPago(), dto.getName(), dto.getLogo());
}

@Transactional
public MedioPagoDTO actualizarMedioPagoPredeterminado(Integer id, MedioPagoDTO dto) {
    // 1) LOG: qué ID y qué DTO llegan realmente
    log.warn("🔍 PUT /payment-methods/{}  body={}", id, dto);

    // 2) Buscar el registro
    MedioPago mp = medioPagoRepository.findByIdSinJoin(id)
        .orElseThrow(() -> new RuntimeException("Medio de pago no encontrado"));

    // 3) Segunda validación: solo predeterminados
    if (mp.getUsuario() != null) {
        throw new RuntimeException("No se puede editar un medio de pago de usuario");
    }

    // 4) Actualizar únicamente el nombre
    mp.setNombreMedioPago(dto.getName());
    MedioPago guardado = medioPagoRepository.save(mp);

    // 5) Devolver DTO (logo se devuelve sin persistir por ahora)
    return new MedioPagoDTO(guardado.getIdMedioPago(),
                            guardado.getNombreMedioPago(),
                            dto.getLogo());
}

@Transactional
public void eliminarMedioPagoPredeterminado(Integer id) {
    // 1. Verificar que exista y sea predeterminado
    MedioPago mp = medioPagoRepository.findByIdSinJoin(id)
            .orElseThrow(() -> new RuntimeException("Medio de pago no encontrado"));

    if (mp.getUsuario() != null) {
        throw new RuntimeException("No se puede eliminar un medio de pago de usuario");
    }

    // 2. Eliminación física
    medioPagoRepository.delete(mp);
}

@Transactional
public CategoriaDTO actualizarCategoriaPredeterminada(Integer id, CategoriaDTO dto) {
    Categoria cat = categoriaRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));

    if (cat.getUsuario() != null) {
        throw new RuntimeException("No se puede editar una categoría de usuario");
    }

    // 1. Nombre
    cat.setNombreCategoria(dto.getLabel());

    // 2. Icono y color (si los guardas en la BD; si no, solo visuales)
    //    Si NO hay columnas icon/color, comenta estas líneas
    // cat.setIcon(dto.getIcon());
    // cat.setColor(dto.getColor());

    Categoria guardada = categoriaRepository.save(cat);

    // 3. Recalcular cantidad de subcategorías (opcional)
    Long count = subcategoriaRepository.countByCategoria(guardada);

    return new CategoriaDTO(
            guardada.getIdCategoria(),
            guardada.getNombreCategoria(),
            dto.getIcon(),      // o null si solo es visual
            dto.getColor(),     // o null
            count);
}

@Transactional
public void eliminarCategoriaPredeterminada(Integer id) {
    Categoria cat = categoriaRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));

    if (cat.getUsuario() != null) {
        throw new RuntimeException("No se puede eliminar una categoría de usuario");
    }

    // Eliminación física (subcategorías deben tener ON DELETE CASCADE)
    categoriaRepository.delete(cat);
}
@Transactional
public void eliminarSubcategoriaPredeterminada(Integer id) {
    Subcategoria sub = subcategoriaRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Subcategoría no encontrada"));

    // Solo predeterminadas (sin usuario)
    if (sub.getUsuario() != null) {
        throw new RuntimeException("No se puede eliminar una subcategoría de usuario");
    }

    subcategoriaRepository.delete(sub);
}

/* ---------- EDITAR SUBCATEGORÍA (PUT) ---------- */
@Transactional
public SubcategoriaDTO actualizarSubcategoriaPredeterminada(Integer id, SubcategoriaDTO dto) {
    Subcategoria sub = subcategoriaRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Subcategoría no encontrada"));

    if (sub.getUsuario() != null) {
        throw new RuntimeException("No se puede editar una subcategoría de usuario");
    }

    // 1. Nombre legible
    sub.setNombreSubcategoria(dto.getLabel());

    // 2. Cambiar categoría padre (si se envió)
    if (dto.getCategoriaId() != null && !dto.getCategoriaId().equals(sub.getCategoria().getIdCategoria())) {
        Categoria nueva = categoriaRepository.findById(dto.getCategoriaId())
                .orElseThrow(() -> new RuntimeException("Categoría destino no encontrada"));
        sub.setCategoria(nueva);
    }

    // 3. Guardar
    Subcategoria guardada = subcategoriaRepository.save(sub);

    // 4. Devolver DTO (usamos los campos que tienes)
    return new SubcategoriaDTO(
            guardada.getIdSubcategoria(),
            guardada.getNombreSubcategoria().toLowerCase().replaceAll("\\s+", "_"), // name técnico
            guardada.getNombreSubcategoria(),                                       // label legible
            dto.getIcon(),                                                          // icono que mandó front
            guardada.getCategoria().getIdCategoria()                                // categoría padre
    );
}

@Transactional
public SubcategoriaDTO crearSubcategoriaPredeterminada(SubcategoriaDTO dto) {
    // 1. Validar categoría padre
    Categoria categoria = categoriaRepository.findById(dto.getCategoriaId())
            .orElseThrow(() -> new RuntimeException("Categoría padre no encontrada"));

    // 2. Crear subcategoría (sin usuario = predeterminada)
    Subcategoria nueva = Subcategoria.builder()
            .nombreSubcategoria(dto.getLabel())
            .categoria(categoria)
            .usuario(null) // predeterminada
            .build();

    Subcategoria guardada = subcategoriaRepository.save(nueva);

    // 3. Devolver DTO
    return new SubcategoriaDTO(
            guardada.getIdSubcategoria(),
            guardada.getNombreSubcategoria().toLowerCase().replaceAll("\\s+", "_"),
            guardada.getNombreSubcategoria(),
            dto.getIcon(), // opcional
            guardada.getCategoria().getIdCategoria()
    );
}

@Transactional
public CategoriaDTO crearCategoriaPredeterminada(CategoriaDTO dto) {
    // 1. Validar que no exista el nombre (opcional)
    if (categoriaRepository.existsByNombreCategoriaAndUsuarioIsNull(dto.getLabel())) {
        throw new RuntimeException("Ya existe una categoría predeterminada con ese nombre");
    }

    // 2. Obtener fuente predeterminada (id = 1)
    FuenteCategoria fuente = fuenteCategoriaRepository.findById(1)
        .orElseThrow(() -> new RuntimeException("Fuente predeterminada no encontrada"));

    // 3. Crear categoría (sin usuario = predeterminada)
Categoria nueva = Categoria.builder()
        .nombreCategoria(dto.getLabel())
        .fuente(fuente)         // ← nombre real del campo
        .usuario(null)          // predeterminada
        .build();

    Categoria guardada = categoriaRepository.save(nueva);

    // 4. Contar subcategorías (0 al crear)
    Long count = subcategoriaRepository.countByCategoria(guardada);

    // 5. Devolver DTO
    return new CategoriaDTO(
            guardada.getIdCategoria(),
            guardada.getNombreCategoria(),
            dto.getIcon(),      // visual
            dto.getColor(),     // visual
            count
    );
}

}
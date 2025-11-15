package com.finli.controller; 

// NUEVAS IMPORTACIONES NECESARIAS
import com.finli.dto.PaginacionUsuarioResponse;
import com.finli.dto.UpdateUserRequest; // <-- NUEVA IMPORTACIÓN
import com.finli.model.EstadoUsuario;
import com.finli.model.TipoSuscripcion;
import com.finli.model.Usuario;
import com.finli.repository.TipoSuscripcionRepository;
import com.finli.service.AdministradorService;
import com.finli.service.ExcelExportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.time.LocalDate; // Para mapear la fecha de registro
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AdminController {

    private final AdministradorService administradorService;
    private final ExcelExportService excelExportService;
    private final TipoSuscripcionRepository tipoSuscripcionRepository;

    // =================================================================================
    // === LISTAR USUARIOS (Con Búsqueda) ===
    // =================================================================================
    @GetMapping("/usuarios")
    public ResponseEntity<PaginacionUsuarioResponse> getUsuariosPaginadosYFiltrados(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(defaultValue = "all", name = "subscriptionType") String status, 
            @RequestParam(required = false) String searchTerm) { 

        if (!status.equalsIgnoreCase("all") && 
            !status.equalsIgnoreCase("active") && 
            !status.equalsIgnoreCase("inactive")) {
            status = "all";
        }
        
        PaginacionUsuarioResponse response = administradorService.getUsuariosPaginadosYFiltrados(
            page, 
            limit, 
            status, 
            searchTerm 
        );

        return ResponseEntity.ok(response);
    }
    // =================================================================================
    // === LISTAR TIPOS DE SUSCRIPCIÓN ===
    // =================================================================================
    @GetMapping("/tipos-suscripcion")
    public ResponseEntity<List<TipoSuscripcion>> listarTiposSuscripcion() {
        List<TipoSuscripcion> tipos = tipoSuscripcionRepository.findAll();
        return ResponseEntity.ok(tipos);
    }
    // =================================================================================

    // CREAR CLIENTE (Se mantiene)
    @PostMapping("/usuarios")
    public ResponseEntity<Usuario> crearCliente(@RequestBody Usuario usuario) {
        Usuario nuevoUsuario = administradorService.guardarCliente(usuario);
        return new ResponseEntity<>(nuevoUsuario, HttpStatus.CREATED);
    }

    // =================================================================================
    // === ACTUALIZAR USUARIO (MODIFICADO: Usa UpdateUserRequest DTO) ===
    // =================================================================================
    @PutMapping("/usuarios/{id}")
    // Cambiamos Usuario por UpdateUserRequest para capturar todos los datos del frontend
    public ResponseEntity<Usuario> actualizarUsuario(@PathVariable Integer id, @RequestBody UpdateUserRequest request) {
        
        // 1. Mapear DTO de entrada a la Entidad Usuario para la parte de datos personales y estado
        Usuario usuarioAActualizar = Usuario.builder()
            .id(id)
            .correo(request.getCorreo())
            .nombre(request.getNombre())
            .apellidoPaterno(request.getApellidoPaterno())
            .apellidoMaterno(request.getApellidoMaterno())
            .edad(request.getEdad())
            // Convertir String de fecha a LocalDate para la Entidad (asumiendo formato y no nulo)
            .fechaRegistro(request.getFechaRegistro() != null ? LocalDate.parse(request.getFechaRegistro()) : null)
            .estadoUsuario(request.getEstadoUsuario())
            .build();
            
        // 2. Llamamos al servicio pasando el Usuario y los campos auxiliares
        Optional<Usuario> usuarioActualizado = administradorService.actualizarUsuario(
            usuarioAActualizar,
            request.getNuevaContrasena(),
            request.getNuevoTipoSuscripcionId()
        );

        return usuarioActualizado
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    // =================================================================================

    // LISTAR ESTADOS DE USUARIO (Se mantiene)
    @GetMapping("/estados-usuario")
    public ResponseEntity<List<EstadoUsuario>> listarEstados() {
        List<EstadoUsuario> estados = administradorService.listarTodosEstadosUsuario();
        return ResponseEntity.ok(estados);
    }

    // ELIMINAR USUARIO (ELIMINACIÓN LÓGICA - Se mantiene)
    @DeleteMapping("/usuarios/{id}")
    public ResponseEntity<Void> eliminarUsuario(@PathVariable Integer id) {
        boolean eliminado = administradorService.eliminarUsuarioLogico(id);

        if (eliminado) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // EXPORTAR A EXCEL (Se mantiene)
    @GetMapping("/usuarios/exportar")
    public ResponseEntity<byte[]> exportarUsuariosAExcel() {
        try {
            List<Usuario> usuarios = administradorService.obtenerListaDeUsuariosParaExportar();

            byte[] excelBytes = excelExportService.exportUsersToExcel(usuarios);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(
                    MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"));
            headers.setContentDispositionFormData("attachment",
                    "usuarios_finli_" + System.currentTimeMillis() + ".xlsx");
            headers.setContentLength(excelBytes.length);

            return new ResponseEntity<>(excelBytes, headers, HttpStatus.OK);

        } catch (IOException e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
package com.finli.controller;

import com.finli.dto.UserAdminDTO;
import com.finli.dto.UserCreateDTO;
import com.finli.dto.UserDetailDTO;
import com.finli.dto.UserHomeDTO;
import com.finli.model.Usuario;
import com.finli.repository.UsuarioRepository;
import com.finli.service.AdministradorService;
import com.finli.service.ExcelExportService; // <-- NUEVO
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders; // <-- NUEVO
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType; // <-- NUEVO
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException; // <-- NUEVO
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminUsuarioController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private AdministradorService administradorService;

    @Autowired
    private ExcelExportService excelExportService; // <-- Inyectamos el servicio de Excel

    // --- 1. LISTAR USUARIOS (GET) ---
    @GetMapping("/users")
    public ResponseEntity<List<UserAdminDTO>> listarUsuariosParaAdmin(
            @RequestParam(value = "search", required = false) String search) {

        List<UsuarioRepository.UserAdminProjection> dbUsers = usuarioRepository.obtenerDatosAdmin(search);

        List<UserAdminDTO> response = dbUsers.stream().map(proj -> {
            String nombreCompleto = proj.getNombre() + " " + proj.getApellido();

            return new UserAdminDTO(
                    proj.getId(),
                    nombreCompleto,
                    proj.getEmail(),
                    proj.getSuscripcion(),
                    "2024-01-01", // Fecha fija temporal
                    null, // Foto null
                    proj.getEstado());
        }).collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    // --- 2. CREAR USUARIO (POST) ---
    @PostMapping("/users")
    public ResponseEntity<?> crearUsuario(@RequestBody UserCreateDTO dto) {
        try {
            Usuario nuevoUsuario = administradorService.crearUsuarioConSuscripcion(dto);
            return new ResponseEntity<>(nuevoUsuario, HttpStatus.CREATED);

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error interno al crear el usuario.");
        }
    }

    // --- 3. OBTENER DETALLE PARA EDITAR (GET /users/{id}) ---
    @GetMapping("/users/{id}")
    public ResponseEntity<?> obtenerUsuario(@PathVariable Integer id) {
        try {
            UserDetailDTO detalle = administradorService.obtenerUsuarioParaEditar(id);
            return ResponseEntity.ok(detalle);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // --- 4. ACTUALIZAR USUARIO (PUT /users/{id}) ---
    @PutMapping("/users/{id}")
    public ResponseEntity<?> actualizarUsuario(@PathVariable Integer id, @RequestBody UserCreateDTO dto) {
        try {
            Usuario actualizado = administradorService.actualizarUsuarioDesdeAdmin(id, dto);
            return ResponseEntity.ok(actualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // --- 5. EXPORTAR EXCEL (GET /users/export/excel) [NUEVO] ---
    @GetMapping("/users/export/excel")
    public ResponseEntity<byte[]> exportarExcel() {
        try {
            // 1. Obtenemos la lista de usuarios (entidades completas)
            List<Usuario> usuarios = administradorService.obtenerListaDeUsuariosParaExportar();

            // 2. Generamos el archivo Excel en bytes
            byte[] excelBytes = excelExportService.exportUsersToExcel(usuarios);

            // 3. Preparamos los encabezados para la descarga
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(
                    MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"));

            // Nombre del archivo dinámico con fecha/hora
            String filename = "usuarios_finli_" + System.currentTimeMillis() + ".xlsx";
            headers.setContentDispositionFormData("attachment", filename);
            headers.setCacheControl("must-revalidate, post-check=0, pre-check=0");

            return new ResponseEntity<>(excelBytes, headers, HttpStatus.OK);

        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

   @GetMapping("/users/latest")
public ResponseEntity<List<UserHomeDTO>> getLatestUsersForHome() {
    List<Object[]> rows = usuarioRepository.findLatestUsersForHomeRaw();
    List<UserHomeDTO> dto = rows.stream()
        .map(r -> new UserHomeDTO(
            (Integer) r[0],
            (String) r[1],
            (String) r[2],
            (String) r[3],
            (String) r[4],
            r[5].toString(),
            (String) r[6]
        ))
        .collect(Collectors.toList());
    return ResponseEntity.ok(dto);
}
}
package com.finli.controller;

import com.finli.dto.UsuarioResponse;
import com.finli.model.EstadoUsuario;
import com.finli.model.Usuario;
import com.finli.service.AdministradorService;
import com.finli.service.ExcelExportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AdminController {

    private final AdministradorService administradorService;
    private final ExcelExportService excelExportService;

    // LISTAR USUARIOS
    @GetMapping("/usuarios")
    public ResponseEntity<List<UsuarioResponse>> listarUsuarios() {
        List<UsuarioResponse> usuarios = administradorService.obtenerTodosLosUsuarios();
        return ResponseEntity.ok(usuarios);
    }

    // CREAR CLIENTE
    @PostMapping("/usuarios")
    public ResponseEntity<Usuario> crearCliente(@RequestBody Usuario usuario) {
        Usuario nuevoUsuario = administradorService.guardarCliente(usuario);
        return new ResponseEntity<>(nuevoUsuario, HttpStatus.CREATED);
    }

    // ACTUALIZAR USUARIO
    @PutMapping("/usuarios/{id}")
    public ResponseEntity<Usuario> actualizarUsuario(@PathVariable Integer id, @RequestBody Usuario usuario) {
        usuario.setId(id);

        Optional<Usuario> usuarioActualizado = administradorService.actualizarUsuario(usuario);

        return usuarioActualizado
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // LISTAR ESTADOS DE USUARIO
    @GetMapping("/estados-usuario")
    public ResponseEntity<List<EstadoUsuario>> listarEstados() {
        List<EstadoUsuario> estados = administradorService.listarTodosEstadosUsuario();
        return ResponseEntity.ok(estados);
    }

    // ELIMINAR USUARIO (ELIMINACIÓN LÓGICA)
    @DeleteMapping("/usuarios/{id}")
    public ResponseEntity<Void> eliminarUsuario(@PathVariable Integer id) {
        boolean eliminado = administradorService.eliminarUsuarioLogico(id);

        if (eliminado) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // EXPORTAR A EXCEL
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
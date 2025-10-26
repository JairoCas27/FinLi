package com.finli.service;

import com.finli.dto.UsuarioResponse;
import com.finli.model.EstadoUsuario;
import com.finli.model.Usuario;
import com.finli.repository.EstadoUsuarioRepository;
import com.finli.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
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
    private final Integer ID_ESTADO_INACTIVO = 2;

    // LISTAR USUARIOS

    public List<UsuarioResponse> obtenerTodosLosUsuarios() {
        List<Usuario> usuarios = usuarioRepository.findAll();

        return usuarios.stream()
                .map(servicioAutenticacion::toResponse)
                .collect(Collectors.toList());
    }

    // EXPORTACIÓN A EXCEL

    public List<Usuario> obtenerListaDeUsuariosParaExportar() {
        return usuarioRepository.findAll();
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
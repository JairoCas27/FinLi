package com.finli.service;

import com.finli.dto.UsuarioResponse;
import com.finli.model.Usuario;
import com.finli.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdministradorService { // ¡NOMBRE CORREGIDO!

    private final UsuarioRepository usuarioRepository;
    private final ServicioAutenticacion servicioAutenticacion; // Necesario para la conversión

    public List<UsuarioResponse> obtenerTodosLosUsuarios() {
        // 1. Obtiene todos los objetos Usuario del repositorio
        List<Usuario> usuarios = usuarioRepository.findAll();

        // 2. Mapea cada objeto Usuario a un UsuarioResponse
        return usuarios.stream()
                // Usamos el método existente en ServicioAutenticacion para convertir
                .map(servicioAutenticacion::toResponse) 
                .collect(Collectors.toList());
    }
}
package com.finli.controller;

import com.finli.model.Categoria;
import com.finli.model.Subcategoria;
import com.finli.model.Usuario;
import com.finli.service.CategoriaService;
import com.finli.service.ServicioAutenticacion;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CategoriaControllerTest {

    @Mock
    private CategoriaService categoriaService;

    @Mock
    private ServicioAutenticacion authService;

    @InjectMocks
    private CategoriaController categoriaController;

    @Test
    void listarPorUsuario_UsuarioExiste_RetornaCategorias() {
        // Arrange
        String email = "test@categoria.com";
        Usuario usuario = Usuario.builder().id(1).correo(email).build();
        List<Categoria> categorias = Arrays.asList(
                Categoria.builder().idCategoria(1).nombreCategoria("Comida").build(),
                Categoria.builder().idCategoria(2).nombreCategoria("Transporte").build()
        );

        when(authService.buscarPorCorreo(email)).thenReturn(Optional.of(usuario));
        when(categoriaService.obtenerCategoriasPorUsuario(usuario)).thenReturn(categorias);

        // Act
        ResponseEntity<List<Categoria>> response = categoriaController.listarPorUsuario(email);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(2, response.getBody().size());
    }

    @Test
    void crear_CategoriaValida_RetornaCategoriaCreada() {
        // Arrange
        String email = "test@categoria.com";
        Usuario usuario = Usuario.builder().id(1).correo(email).build();
        Categoria categoria = Categoria.builder().idCategoria(1).nombreCategoria("Nueva Categoria").build();

        when(authService.buscarPorCorreo(email)).thenReturn(Optional.of(usuario));
        when(categoriaService.guardarCategoria(any(Categoria.class))).thenReturn(categoria);

        // Act
        ResponseEntity<Categoria> response = categoriaController.crear(categoria, email);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("Nueva Categoria", response.getBody().getNombreCategoria());
    }
}
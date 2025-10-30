package com.finli.service;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;

import com.finli.model.Categoria;
import com.finli.model.Usuario;
import com.finli.repository.CategoriaRepository;
import com.finli.repository.SubcategoriaRepository;

@ExtendWith(MockitoExtension.class)
class CategoriaServiceTest {

    @Mock
    private CategoriaRepository categoriaRepository;

    @Mock
    private SubcategoriaRepository subcategoriaRepository;

    @InjectMocks
    private CategoriaService categoriaService;

    @Test
    void obtenerCategoriasPorUsuario_UsuarioValido_RetornaLista() {
        // Arrange
        Usuario usuario = Usuario.builder().id(1).build();
        List<Categoria> categorias = Arrays.asList(
                Categoria.builder().idCategoria(1).nombreCategoria("Comida").build(),
                Categoria.builder().idCategoria(2).nombreCategoria("Transporte").build()
        );
        when(categoriaRepository.findByUsuario(usuario)).thenReturn(categorias);

        // Act
        List<Categoria> resultado = categoriaService.obtenerCategoriasPorUsuario(usuario);

        // Assert
        assertEquals(2, resultado.size());
        verify(categoriaRepository).findByUsuario(usuario);
    }

    @Test
    void guardarCategoria_CategoriaValida_RetornaCategoriaGuardada() {
        // Arrange
        Usuario usuario = Usuario.builder().id(1).build();
        Categoria categoria = Categoria.builder()
                .nombreCategoria("Nueva Categoria")
                .usuario(usuario)
                .build();
        when(categoriaRepository.save(any(Categoria.class))).thenReturn(categoria);

        // Act
        Categoria resultado = categoriaService.guardarCategoria(categoria);

        // Assert
        assertNotNull(resultado);
        assertEquals("Nueva Categoria", resultado.getNombreCategoria());
        verify(categoriaRepository).save(categoria);
    }

    @Test
    void guardarCategoria_NombreVacio_LanzaExcepcion() {
        // Arrange
        Usuario usuario = Usuario.builder().id(1).build();
        Categoria categoria = Categoria.builder()
                .nombreCategoria("")
                .usuario(usuario)
                .build();

        // Act & Assert
        assertThrows(IllegalArgumentException.class, () -> {
            categoriaService.guardarCategoria(categoria);
        });
    }

    @Test
    void buscarPorId_IdExistente_RetornaCategoria() {
        // Arrange
        Categoria categoria = Categoria.builder().idCategoria(1).build();
        when(categoriaRepository.findById(1)).thenReturn(Optional.of(categoria));

        // Act
        Optional<Categoria> resultado = categoriaService.buscarPorId(1);

        // Assert
        assertTrue(resultado.isPresent());
        assertEquals(1, resultado.get().getIdCategoria());
    }
}
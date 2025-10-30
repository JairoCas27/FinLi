package com.finli.model;

import static org.junit.jupiter.api.Assertions.assertEquals;
import org.junit.jupiter.api.Test;

class SubcategoriaTest {

    @Test
    void subcategoria_Builder_Success() {
        // Arrange
        Categoria categoria = Categoria.builder().idCategoria(1).build();
        Usuario usuario = Usuario.builder().id(1).build();

        // Act
        Subcategoria subcategoria = Subcategoria.builder()
            .idSubcategoria(1)
            .nombreSubcategoria("Restaurante")
            .categoria(categoria)
            .usuario(usuario)
            .build();

        // Assert
        assertEquals(1, subcategoria.getIdSubcategoria());
        assertEquals("Restaurante", subcategoria.getNombreSubcategoria());
        assertEquals(categoria, subcategoria.getCategoria());
        assertEquals(usuario, subcategoria.getUsuario());
    }
}
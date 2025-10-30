package com.finli.model;

import static org.junit.jupiter.api.Assertions.assertEquals;
import org.junit.jupiter.api.Test;

class CategoriaTest {

    @Test
    void categoria_Builder_Success() {
        // Arrange
        FuenteCategoria fuente = FuenteCategoria.builder().idFuente(1).build();
        Usuario usuario = Usuario.builder().id(1).build();

        // Act
        Categoria categoria = Categoria.builder()
            .idCategoria(1)
            .nombreCategoria("Comida")
            .fuente(fuente)
            .usuario(usuario)
            .build();

        // Assert
        assertEquals(1, categoria.getIdCategoria());
        assertEquals("Comida", categoria.getNombreCategoria());
        assertEquals(fuente, categoria.getFuente());
        assertEquals(usuario, categoria.getUsuario());
    }
}
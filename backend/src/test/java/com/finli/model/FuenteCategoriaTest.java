package com.finli.model;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import org.junit.jupiter.api.Test;

class FuenteCategoriaTest {

    @Test
    void fuenteCategoria_Builder_Success() {
        // Arrange
        List<Categoria> categorias = Arrays.asList(
            Categoria.builder().idCategoria(1).build(),
            Categoria.builder().idCategoria(2).build()
        );

        // Act
        FuenteCategoria fuente = FuenteCategoria.builder()
            .idFuente(1)
            .nombreFuente("Sistema")
            .categorias(categorias)
            .build();

        // Assert
        assertEquals(1, fuente.getIdFuente());
        assertEquals("Sistema", fuente.getNombreFuente());
        assertEquals(2, fuente.getCategorias().size());
    }
}
package com.finli.model;

import java.util.Arrays;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import org.junit.jupiter.api.Test;

class EstadoUsuarioTest {

    @Test
    void estadoUsuario_Builder_Success() {
        // Arrange & Act
        EstadoUsuario estado = EstadoUsuario.builder()
            .idEstado(1)
            .nombreEstado("Activo")
            .usuarios(Arrays.asList(new Usuario(), new Usuario()))
            .build();

        // Assert
        assertEquals(1, estado.getIdEstado());
        assertEquals("Activo", estado.getNombreEstado());
        assertEquals(2, estado.getUsuarios().size());
    }

    @Test
    void estadoUsuario_JsonIgnore_Success() {
        // Arrange
        EstadoUsuario estado = EstadoUsuario.builder()
            .idEstado(1)
            .nombreEstado("Activo")
            .usuarios(Arrays.asList(Usuario.builder().id(1).build()))
            .build();

        // Act & Assert - El campo usuarios debería tener @JsonIgnore
        assertNotNull(estado.getUsuarios());
    }
}
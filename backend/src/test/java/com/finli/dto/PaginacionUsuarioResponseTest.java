package com.finli.dto;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.Test;

class PaginacionUsuarioResponseTest {

    @Test
    void paginacionUsuarioResponse_ConstructorAndGetters_Success() {
        // Arrange
        List<UsuarioResponse> users = Arrays.asList(
            UsuarioResponse.builder().id(1).correo("test1@test.com").build(),
            UsuarioResponse.builder().id(2).correo("test2@test.com").build()
        );

        // Act
        PaginacionUsuarioResponse response = new PaginacionUsuarioResponse(users, 100L);

        // Assert
        assertEquals(2, response.getUsers().size());
        assertEquals(100L, response.getTotalCount());
        assertEquals("test1@test.com", response.getUsers().get(0).getCorreo());
    }

    @Test
    void paginacionUsuarioResponse_NoArgsConstructor_Success() {
        // Arrange & Act
        PaginacionUsuarioResponse response = new PaginacionUsuarioResponse();
        response.setUsers(Arrays.asList(UsuarioResponse.builder().id(1).build()));
        response.setTotalCount(50L);

        // Assert
        assertEquals(1, response.getUsers().size());
        assertEquals(50L, response.getTotalCount());
    }

    @Test
    void paginacionUsuarioResponse_DataAnnotations_Success() {
        // Arrange
        List<UsuarioResponse> users = Arrays.asList(UsuarioResponse.builder().id(1).build());

        // Act
        PaginacionUsuarioResponse response = new PaginacionUsuarioResponse(users, 100L);

        // Assert
        assertNotNull(response.toString());
        assertTrue(response.toString().contains("totalCount=100"));
    }
}
package com.finli.controller;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.finli.dto.TransaccionRequest;
import com.finli.model.Transaccion;
import com.finli.service.TransaccionService;

@ExtendWith(MockitoExtension.class)
class TransaccionControllerTest {

    @Mock
    private TransaccionService transaccionService;

    @InjectMocks
    private TransaccionController transaccionController;

    @Test
    void guardar_TransaccionValida_RetornaOk() {
        // Arrange
        TransaccionRequest request = new TransaccionRequest();
        Transaccion transaccion = Transaccion.builder().idTransaccion(1).build();
        
        when(transaccionService.guardar(any(TransaccionRequest.class))).thenReturn(transaccion);

        // Act
        ResponseEntity<?> response = transaccionController.guardar(request);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertTrue(response.getBody().toString().contains("Transacción guardada ID: 1"));
    }

    @Test
    void guardar_TransaccionInvalida_RetornaBadRequest() {
        // Arrange
        TransaccionRequest request = new TransaccionRequest();
        when(transaccionService.guardar(any(TransaccionRequest.class)))
                .thenThrow(new IllegalArgumentException("Monto inválido"));

        // Act
        ResponseEntity<?> response = transaccionController.guardar(request);

        // Assert
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Monto inválido", response.getBody());
    }

    @Test
    void guardar_ExcepcionInesperada_RetornaInternalServerError() {
        // Arrange
        TransaccionRequest request = new TransaccionRequest();
        when(transaccionService.guardar(any(TransaccionRequest.class)))
                .thenThrow(new RuntimeException("Error inesperado"));

        // Act
        ResponseEntity<?> response = transaccionController.guardar(request);

        // Assert
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertEquals("Error interno al guardar transacción", response.getBody());
    }

    @Test
    void listar_ParametrosValidos_RetornaLista() {
        // Arrange
        String email = "test@test.com";
        LocalDateTime inicio = LocalDateTime.now().minusDays(1);
        LocalDateTime fin = LocalDateTime.now();
        List<Transaccion> transacciones = Arrays.asList(
                Transaccion.builder().idTransaccion(1).build(),
                Transaccion.builder().idTransaccion(2).build()
        );
        
        when(transaccionService.listarPorUsuarioYPeriodo(email, inicio, fin))
                .thenReturn(transacciones);

        // Act
        ResponseEntity<List<Transaccion>> response = 
                transaccionController.listar(email, inicio, fin);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(2, response.getBody().size());
    }

    @Test
    void listar_ParametrosInvalidos_RetornaBadRequest() {
        // Arrange
        String email = "test@test.com";
        LocalDateTime inicio = LocalDateTime.now().minusDays(1);
        LocalDateTime fin = LocalDateTime.now();
        
        when(transaccionService.listarPorUsuarioYPeriodo(email, inicio, fin))
                .thenThrow(new IllegalArgumentException("Parámetros inválidos"));

        // Act
        ResponseEntity<List<Transaccion>> response = 
                transaccionController.listar(email, inicio, fin);

        // Assert
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }
}
package com.finli.service;

import com.finli.dto.TransaccionRequest;
import com.finli.model.*;
import com.finli.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TransaccionServiceTest {

    @Mock
    private TransaccionRepository transaccionRepo;

    @Mock
    private ServicioAutenticacion authService;

    @Mock
    private MedioPagoRepository medioPagoRepo;

    @Mock
    private CategoriaRepository categoriaRepo;

    @Mock
    private SubcategoriaRepository subcategoriaRepo;

    @InjectMocks
    private TransaccionService transaccionService;

    private TransaccionRequest transaccionRequest;
    private Usuario usuario;
    private MedioPago medioPago;
    private Categoria categoria;
    private Subcategoria subcategoria;

    @BeforeEach
    void setUp() {
        usuario = Usuario.builder().id(1).correo("test@example.com").build();
        medioPago = MedioPago.builder().idMedioPago(1).nombreMedioPago("Efectivo").build();
        categoria = Categoria.builder().idCategoria(1).nombreCategoria("Comida").build();
        subcategoria = Subcategoria.builder().idSubcategoria(1).nombreSubcategoria("Restaurante").build();

        transaccionRequest = TransaccionRequest.builder()
                .nombreTransaccion("Almuerzo")
                .tipo("gasto")
                .monto(150.50)
                .fecha(LocalDateTime.now().toString())
                .descripcionTransaccion("Almuerzo en restaurante")
                .email("test@example.com")
                .idMedioPago(1)
                .idCategoria(1)
                .idSubcategoria(1)
                .build();
    }

    @Test
    void guardar_TransaccionValida_GuardaCorrectamente() {
        when(authService.buscarPorCorreo("test@example.com")).thenReturn(Optional.of(usuario));
        when(medioPagoRepo.findById(1)).thenReturn(Optional.of(medioPago));
        when(categoriaRepo.findById(1)).thenReturn(Optional.of(categoria));
        when(subcategoriaRepo.findById(1)).thenReturn(Optional.of(subcategoria));
        when(transaccionRepo.save(any(Transaccion.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Transaccion resultado = transaccionService.guardar(transaccionRequest);

        assertNotNull(resultado);
        assertEquals("Almuerzo", resultado.getNombreTransaccion());
        assertEquals("gasto", resultado.getTipo());
    }

    @Test
    void listarPorUsuarioYPeriodo_PeriodoValido_RetornaTransacciones() {
        LocalDateTime inicio = LocalDateTime.now().minusDays(7);
        LocalDateTime fin = LocalDateTime.now();

        Transaccion transaccion = Transaccion.builder()
                .idTransaccion(1)
                .nombreTransaccion("Test")
                .tipo("gasto")
                .monto(100.0)
                .fecha(LocalDateTime.now())
                .usuario(usuario)
                .build();

        when(authService.buscarPorCorreo("test@example.com")).thenReturn(Optional.of(usuario));
        when(transaccionRepo.findByUsuarioAndFechaBetween(usuario, inicio, fin))
                .thenReturn(Arrays.asList(transaccion));

        List<Transaccion> resultado = transaccionService.listarPorUsuarioYPeriodo("test@example.com", inicio, fin);

        assertFalse(resultado.isEmpty());
        assertEquals(1, resultado.size());
    }
}
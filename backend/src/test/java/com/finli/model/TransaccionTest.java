package com.finli.model;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class TransaccionTest {

    @Test
    void validar_TransaccionCompletaValida_NoLanzaExcepcion() {
        Usuario usuario = Usuario.builder().id(1).build();
        MedioPago medioPago = MedioPago.builder().idMedioPago(1).build();
        Categoria categoria = Categoria.builder().idCategoria(1).build();
        Subcategoria subcategoria = Subcategoria.builder().idSubcategoria(1).build();

        Transaccion transaccion = Transaccion.builder()
                .nombreTransaccion("Salario")
                .tipo("ingreso")
                .monto(5000.0)
                .fecha(java.time.LocalDateTime.now())
                .usuario(usuario)
                .medioPago(medioPago)
                .categoria(categoria)
                .subcategoria(subcategoria)
                .build();

        assertDoesNotThrow(transaccion::validar);
    }

    @Test
    void validar_NombreTransaccionVacio_LanzaExcepcion() {
        Transaccion transaccion = Transaccion.builder()
                .nombreTransaccion("")
                .tipo("ingreso")
                .monto(100.0)
                .build();

        Exception exception = assertThrows(IllegalArgumentException.class, transaccion::validar);
        assertTrue(exception.getMessage().contains("nombre de la transacción"));
    }
}

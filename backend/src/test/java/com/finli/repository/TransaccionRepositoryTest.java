package com.finli.repository;

import com.finli.model.EstadoUsuario;
import com.finli.model.Transaccion;
import com.finli.model.Usuario;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
class TransaccionRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private TransaccionRepository transaccionRepository;

    @Test
    void findByUsuarioAndFechaBetween_TransaccionesEnRango_RetornaLista() {
        // Arrange - Primero crear y persistir EstadoUsuario y Usuario
        EstadoUsuario estadoActivo = EstadoUsuario.builder()
                .nombreEstado("Activo")
                .build();
        estadoActivo = entityManager.persistAndFlush(estadoActivo);

        Usuario usuario = Usuario.builder()
                .correo("transaccion@test.com")
                .contrasena("password")
                .nombre("Transaccion")
                .apellidoPaterno("User")
                .apellidoMaterno("Test")
                .edad(35)
                .estadoUsuario(estadoActivo) // ASIGNAR ESTADO REQUERIDO
                .build();

        usuario = entityManager.persistAndFlush(usuario);

        Transaccion transaccion = Transaccion.builder()
                .nombreTransaccion("Test Transaction")
                .tipo("ingreso")
                .monto(100.0)
                .fecha(LocalDateTime.now())
                .usuario(usuario)
                .build();

        // Para Transaccion necesitas también MedioPago, Categoria y Subcategoria
        // Pero como solo estamos probando el repositorio, podemos guardar sin esas relaciones
        entityManager.persistAndFlush(transaccion);

        LocalDateTime inicio = LocalDateTime.now().minusDays(1);
        LocalDateTime fin = LocalDateTime.now().plusDays(1);

        // Act
        List<Transaccion> result = transaccionRepository.findByUsuarioAndFechaBetween(
                usuario, inicio, fin);

        // Assert
        assertFalse(result.isEmpty());
        assertEquals("Test Transaction", result.get(0).getNombreTransaccion());
    }
}
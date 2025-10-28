package com.finli.service;

import com.finli.dto.TransaccionRequest;
import com.finli.model.*;
import com.finli.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j

public class TransaccionService {

    private final TransaccionRepository transaccionRepo;
    private final ServicioAutenticacion authService;
    private final MedioPagoRepository medioPagoRepo;
    private final CategoriaRepository categoriaRepo;
    private final SubcategoriaRepository subcategoriaRepo;

    @Transactional
    public Transaccion guardar(TransaccionRequest dto) {
        dto.validar();

        Usuario usuario = authService.buscarPorCorreo(dto.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));

        MedioPago mp = medioPagoRepo.findById(dto.getIdMedioPago())
                .orElseThrow(() -> new IllegalArgumentException("Medio de pago no encontrado"));

        Categoria cat = categoriaRepo.findById(dto.getIdCategoria())
                .orElseThrow(() -> new IllegalArgumentException("Categoría no encontrada"));

        Subcategoria sub = subcategoriaRepo.findById(dto.getIdSubcategoria())
                .orElseThrow(() -> new IllegalArgumentException("Subcategoría no encontrada"));

        Transaccion t = Transaccion.builder()
                .nombreTransaccion(dto.getNombreTransaccion())
                .tipo(dto.getTipo())
                .monto(dto.getMonto())
                .fecha(LocalDateTime.parse(dto.getFecha()))
                .descripcionTransaccion(dto.getDescripcionTransaccion())
                .imagen(dto.getImagen())
                .usuario(usuario)
                .medioPago(mp)
                .categoria(cat)
                .subcategoria(sub)
                .build();

        t.validar();

        log.info("Guardando transacción: {} para usuario: {}", t.getNombreTransaccion(), usuario.getCorreo());
        return transaccionRepo.save(t);
    }

    public List<Transaccion> listarPorUsuarioYPeriodo(String email, LocalDateTime inicio, LocalDateTime fin) {
        Usuario usuario = authService.buscarPorCorreo(email)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));
        log.info("Listando transacciones para usuario: {} entre {} y {}", email, inicio, fin);
        return transaccionRepo.findByUsuarioAndFechaBetween(usuario, inicio, fin);
    }
}
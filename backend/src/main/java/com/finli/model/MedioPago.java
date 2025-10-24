package com.finli.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "MedioPago")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MedioPago {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idMedioPago;

    @Column(name = "nombre_medioPago", nullable = false, length = 100)
    private String nombreMedioPago;

    @Column(name = "monto_inicial", nullable = false)
    private Double montoInicial;

    @Column(name = "fecha_creacion", nullable = false)
    private LocalDateTime fechaCreacion;

    @ManyToOne
    @JoinColumn(name = "id_usuario", nullable = true)
    private Usuario usuario;
}

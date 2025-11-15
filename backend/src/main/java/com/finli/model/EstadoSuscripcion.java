package com.finli.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "EstadoSuscripcion")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EstadoSuscripcion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_estadosuscripcion")
    private Integer idEstadoSuscripcion;

    @Column(name = "nombre_estado", nullable = false, length = 50)
    private String nombreEstado;
}
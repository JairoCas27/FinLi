package com.finli.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Entity
@Table(name = "Suscripciones")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Suscripciones {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_suscripcion")
    private Integer idSuscripcion;

    // Relación con Usuario (quién tiene la suscripción)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario; // Solo para mapeo inverso, lo ignoraremos aquí

    // Relación con TipoSuscripcion (el plan: Mensual, Anual, etc.)
    @ManyToOne(fetch = FetchType.EAGER) // EAGER para que se cargue con el DTO
    @JoinColumn(name = "id_tiposuscripcion", nullable = false)
    private TipoSuscripcion tipoSuscripcion;

    // Relación con EstadoSuscripcion (Activa, Cancelada, etc.)
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_estadosuscripcion", nullable = false)
    private EstadoSuscripcion estadoSuscripcion;
    
    @Column(name = "fecha_inicio", nullable = false)
    private LocalDate fechaInicio;

    @Column(name = "fecha_fin")
    private LocalDate fechaFin;
}

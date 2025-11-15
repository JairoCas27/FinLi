package com.finli.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

@Entity
@Table(name = "TipoSuscripcion")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TipoSuscripcion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_tiposuscripcion")
    private Integer idTipoSuscripcion;

    @Column(name = "nombre_tiposuscripcion", nullable = false, length = 50)
    private String nombreTipoSuscripcion;
}
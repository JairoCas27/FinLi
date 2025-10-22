package com.finli.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "FuenteCategoria")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FuenteCategoria {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idFuente;

    @Column(name = "nombre_fuente", nullable = false, unique = true)
    private String nombreFuente;
}
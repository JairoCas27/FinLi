package com.finli.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "Categorias")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Categoria {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idCategoria;

    @Column(name = "nombre_categoria", nullable = false)
    private String nombreCategoria;

    @ManyToOne
    @JoinColumn(name = "id_fuente", nullable = false)
    private FuenteCategoria fuente;

    @ManyToOne
    @JoinColumn(name = "id_usuario", nullable = true)
    private Usuario usuario;
}
package com.finli.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "Subcategorias")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Subcategoria {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idSubcategoria;

    @Column(name = "nombre_subcategoria", nullable = false)
    private String nombreSubcategoria;

    @ManyToOne
    @JoinColumn(name = "id_categoria", nullable = false)
    private Categoria categoria;

    @ManyToOne
    @JoinColumn(name = "id_usuario", nullable = true)
    private Usuario usuario;
}
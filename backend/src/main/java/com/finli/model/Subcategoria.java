package com.finli.model;

import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonIgnore; // 💡 Importación para Jackson/JSON

@Entity
@Table(name = "Subcategorias")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Subcategoria {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_subcategoria") // Agregamos el nombre de columna explícito
    private Integer idSubcategoria;

    @Column(name = "nombre_subcategoria", nullable = false)
    private String nombreSubcategoria;

    // 💡 AJUSTE CRÍTICO: Usamos @JsonIgnore aquí. 
    // Cuando serializamos una Subcategoría, ignoramos el campo 'categoria' padre, 
    // lo que rompe la recursión Categoria -> Subcategoria -> Categoria.
    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY) // Usamos LAZY para mejor rendimiento
    @JoinColumn(name = "id_categoria", nullable = false)
    private Categoria categoria;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario", nullable = true)
    private Usuario usuario;
}
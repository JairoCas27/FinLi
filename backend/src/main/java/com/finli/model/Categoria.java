package com.finli.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;
import java.util.ArrayList; // Importar ArrayList
import com.fasterxml.jackson.annotation.JsonIgnoreProperties; // 💡 Importación necesaria

@Entity
@Table(name = "Categorias")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
// 💡 AJUSTE CRÍTICO: Ignorar las propiedades internas de Hibernate 
// ('handler' y 'hibernateLazyInitializer') que causan el error de serialización.
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"}) 
public class Categoria {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_categoria")
    private Integer idCategoria;

    @Column(name = "nombre_categoria", nullable = false)
    private String nombreCategoria;

    @ManyToOne(fetch = FetchType.LAZY) // Usamos LAZY para mejor rendimiento
    @JoinColumn(name = "id_fuente", nullable = false)
    private FuenteCategoria fuente;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario", nullable = true)
    private Usuario usuario;
    
    // 💡 AJUSTE CRÍTICO: Agregar la relación OneToMany a Subcategorias
    @OneToMany(mappedBy = "categoria", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default // Usar @Builder.Default para inicializarla con Lombok @Builder
    private List<Subcategoria> subcategorias = new ArrayList<>(); 
}
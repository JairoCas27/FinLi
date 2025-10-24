package com.finli.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.List; 

@Entity
@Table(name = "FuenteCategoria")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FuenteCategoria {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_fuente") 
    private Integer idFuente;

    @Column(name = "nombre_fuente", nullable = false, unique = true)
    private String nombreFuente;

    @OneToMany(mappedBy = "fuente", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Categoria> categorias; 
}
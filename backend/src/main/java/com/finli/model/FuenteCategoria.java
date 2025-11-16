package com.finli.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.List; 
import com.fasterxml.jackson.annotation.JsonIgnore; 
import com.fasterxml.jackson.annotation.JsonIgnoreProperties; // 💡 Importación necesaria

@Entity
@Table(name = "FuenteCategoria")
@Data
@NoArgsConstructor
@AllArgsConstructor
// 💡 AJUSTE CRÍTICO: Ignorar los campos internos de Hibernate (hibernateLazyInitializer y handler)
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Builder
public class FuenteCategoria {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_fuente") 
    private Integer idFuente;

    @Column(name = "nombre_fuente", nullable = false, unique = true)
    private String nombreFuente;

    // Rompe el ciclo (SE MANTIENE)
    @JsonIgnore
    @OneToMany(mappedBy = "fuente", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Categoria> categorias; 
}
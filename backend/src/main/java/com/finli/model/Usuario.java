package com.finli.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate; 
import java.util.List;
import java.util.ArrayList; 
import com.fasterxml.jackson.annotation.JsonIgnore; // 💡 Importación necesaria

@Entity
@Table(name = "Usuarios")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, unique = true, length = 100)
    private String correo;

    @Column(nullable = false, length = 255)
    private String contrasena;

    @Column(nullable = false, length = 50)
    private String nombre;

    @Column(name = "apellido_Paterno", nullable = false, length = 50)
    private String apellidoPaterno;

    @Column(name = "apellido_Materno", nullable = false, length = 50)
    private String apellidoMaterno;

    @Column(nullable = false)
    private Integer edad;
    
    @Column(name = "fecha_registro") 
    private LocalDate fechaRegistro;

    @ManyToOne(fetch = FetchType.LAZY) 
    @JoinColumn(name = "id_estadoUsuario", nullable = false) 
    private EstadoUsuario estadoUsuario;
    
    // =================================================================
    // === NUEVA RELACIÓN: CATEGORÍAS PERSONALIZADAS DEL USUARIO ===
    // =================================================================

    /**
     * AJUSTE CRÍTICO: @JsonIgnore rompe el ciclo Categoria -> Usuario -> Categoria.
     * Al serializar un Usuario, ignoramos la lista de categorías que él creó.
     */
    @JsonIgnore // <-- ¡Añadido para romper el bucle!
    @OneToMany(mappedBy = "usuario", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default 
    private List<Categoria> categorias = new ArrayList<>(); 
    
    // 💡 NOTA: La lista de Medios de Pago también iría aquí si la implementas:
    // @OneToMany(mappedBy = "usuario", cascade = CascadeType.ALL, orphanRemoval = true)
    // @Builder.Default
    // private List<MedioDePago> mediosDePago = new ArrayList<>(); 
}
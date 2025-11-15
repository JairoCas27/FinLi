package com.finli.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate; // <-- NUEVA IMPORTACIÓN

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
    
    // --- NUEVO CAMPO AÑADIDO ---
    @Column(name = "fecha_registro") 
    private LocalDate fechaRegistro; // Asumo que el campo en tu DB es DATE o DATETIME

    @ManyToOne(fetch = FetchType.LAZY) 
    @JoinColumn(name = "id_estadoUsuario", nullable = false) 
    private EstadoUsuario estadoUsuario;
}
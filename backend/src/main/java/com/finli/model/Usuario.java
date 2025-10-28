package com.finli.model;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

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


    @OneToMany(mappedBy = "usuario", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore  // <-- importante para evitar el loop infinito al serializar
    private List<Ingreso> ingresos;

    @OneToMany(mappedBy = "usuario", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Transaccion> transacciones;
}
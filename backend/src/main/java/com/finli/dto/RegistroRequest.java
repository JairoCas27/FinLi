package com.finli.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegistroRequest {
    private String nombre;
    private String apellido;
    private String email;
    private String contrasena;
    private String confirmarContrasena;
}
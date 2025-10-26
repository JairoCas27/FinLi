package com.finli.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UsuarioResponse {
    private Integer id;
    private String email;  
    private String nombre;
    private String apellidoPaterno;
    private String apellidoMaterno;
    private Integer edad;
}
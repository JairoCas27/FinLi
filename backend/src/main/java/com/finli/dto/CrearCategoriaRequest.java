package com.finli.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CrearCategoriaRequest {
    private String nombreCategoria;
    // Si la categoría es personal, necesitamos saber qué usuario la crea.
    private Integer idUsuario; 
}
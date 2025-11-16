package com.finli.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CrearSubcategoriaRequest {
    private String nombreSubcategoria;
    private Integer idCategoria; // CRÍTICO: ID de la Categoría padre (FK)
    private Integer idUsuario;   // ID del usuario que la crea (si es personal)
}
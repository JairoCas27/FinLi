package com.finli.dto;

import lombok.Data;

@Data
public class CompraRequest {

    private String correoUsuario;        // 👈 este
    private String nombreTipoSuscripcion; // 👈 este
    private String email;
    private String cardNumber;

    // Getters y Setters generados por Lombok (@Data)
}

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
    private String correo; // Corregido: Usas 'correo' en el Controller, no 'email'
    private String nombre;
    private String apellidoPaterno;
    private String apellidoMaterno;
    private Integer edad;
    private String fechaRegistro; // Asumimos que lo mapeas como String para el frontend
    
    // Campo CLAVE: Necesario para mostrar el estado en el frontend
    private EstadoUsuarioResponse estadoUsuario; 

    // --- CLASE INTERNA PARA EL ESTADO ---
    // Esto es un DTO anidado para estructurar la respuesta del estado.
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class EstadoUsuarioResponse {
        private Integer idEstado;
        private String nombreEstado;
    }
}
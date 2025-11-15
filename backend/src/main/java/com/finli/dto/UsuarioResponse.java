package com.finli.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UsuarioResponse {
    private Integer id;
    private String correo; 
    private String nombre;
    private String apellidoPaterno;
    private String apellidoMaterno; // Añadido
    private Integer edad;          // Añadido
    private String fechaRegistro; 
    
    // Campo CLAVE: Estado Activo/Inactivo
    private EstadoUsuarioResponse estadoUsuario; 

    // --- NUEVO CAMPO PARA LA SUSCRIPCIÓN ACTUAL ---
    private SuscripcionActualResponse suscripcionActual;
    
    // --- CLASE INTERNA PARA EL ESTADO ACTIVO/INACTIVO ---
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class EstadoUsuarioResponse {
        private Integer idEstado;
        private String nombreEstado;
    }
    
    // --- NUEVA CLASE INTERNA PARA LA SUSCRIPCIÓN ACTUAL ---
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class SuscripcionActualResponse {
        private Integer idTipoSuscripcion;    // ID del plan (Mensual, Anual) para el SELECT
        private String nombreTipoSuscripcion; // Nombre del plan (para mostrar en la tabla)
        private String estadoSuscripcion;     // Estado (Activa, Cancelada)
        private LocalDate fechaInicio;
    }
}
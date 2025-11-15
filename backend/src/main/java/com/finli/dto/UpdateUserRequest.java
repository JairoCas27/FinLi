package com.finli.dto;

import com.finli.model.EstadoUsuario;
import com.finli.model.Usuario; // Opcional: si el mapeo es manual
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateUserRequest {
    
    // Datos personales que van directamente a la Entidad Usuario
    private Integer id;
    private String correo;
    private String nombre;
    private String apellidoPaterno;
    private String apellidoMaterno;
    private Integer edad;
    private String fechaRegistro; // Mantenido como String para la fecha de registro
    private EstadoUsuario estadoUsuario; // Contiene idEstado
    
    // Campos Auxiliares que NO están en la Entidad Usuario
    private String nuevaContrasena;
    private Integer nuevoTipoSuscripcionId; 
    
    // Nota: El campo 'imagen_url' no se maneja aquí directamente, 
    // ya que su lógica (multipart file upload) es más compleja.
}

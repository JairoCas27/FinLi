package com.finli.dto;

import lombok.*;
import org.apache.commons.lang3.StringUtils;
import com.google.common.base.Preconditions;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TransaccionRequest {

    private String nombreTransaccion;
    private String tipo;
    private Double monto;
    private String fecha; 
    private String descripcionTransaccion;
    private String imagen;
    private String email;
    private Integer idMedioPago;
    private Integer idCategoria;
    private Integer idSubcategoria;

    public void validar() {
        Preconditions.checkArgument(StringUtils.isNotBlank(nombreTransaccion), "Nombre de transacción requerido");
        Preconditions.checkArgument(StringUtils.isNotBlank(tipo), "Tipo requerido");
        Preconditions.checkArgument(tipo.equals("ingreso") || tipo.equals("gasto"), "Tipo inválido");
        Preconditions.checkArgument(monto != null && monto > 0, "Monto inválido");
        Preconditions.checkArgument(StringUtils.isNotBlank(fecha), "Fecha requerida");
        Preconditions.checkArgument(StringUtils.isNotBlank(email), "Email requerido");
        Preconditions.checkArgument(idMedioPago != null, "Medio de pago requerido");
        Preconditions.checkArgument(idCategoria != null, "Categoría requerida");
        Preconditions.checkArgument(idSubcategoria != null, "Subcategoría requerida");
    }
}
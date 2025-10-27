package com.finli.model;

import jakarta.persistence.*;
import lombok.*;
import org.apache.commons.lang3.StringUtils;
import com.google.common.base.Preconditions;

import java.time.LocalDateTime;

@Entity
@Table(name = "Transacciones")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Transaccion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idTransaccion;

    @Column(name = "nombre_transaccion", nullable = false, length = 100)
    private String nombreTransaccion;

    @Column(nullable = false, length = 10)
    private String tipo; // ingreso o gasto

    @Column(nullable = false)
    private Double monto;

    @Column(nullable = false)
    private LocalDateTime fecha;

    @Column(name = "descripcion_transaccion", length = 100)
    private String descripcionTransaccion;

    @Column(columnDefinition = "LONGTEXT")
    private String imagen;

    @ManyToOne(optional = false)
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

    @ManyToOne(optional = false)
    @JoinColumn(name = "id_medioPago", nullable = false)
    private MedioPago medioPago;

    @ManyToOne(optional = false)
    @JoinColumn(name = "id_categoria", nullable = false)
    private Categoria categoria;

    @ManyToOne(optional = false)
    @JoinColumn(name = "id_subcategoria", nullable = false)
    private Subcategoria subcategoria;

    // Validación interna con Guava
    public void validar() {
        Preconditions.checkArgument(StringUtils.isNotBlank(nombreTransaccion), "El nombre de la transacción es obligatorio");
        Preconditions.checkArgument(tipo != null && (tipo.equals("ingreso") || tipo.equals("gasto")), "El tipo debe ser 'ingreso' o 'gasto'");
        Preconditions.checkArgument(monto != null && monto > 0, "El monto debe ser mayor a 0");
        Preconditions.checkArgument(fecha != null, "La fecha es obligatoria");
        Preconditions.checkArgument(usuario != null, "El usuario es obligatorio");
        Preconditions.checkArgument(medioPago != null, "El medio de pago es obligatorio");
        Preconditions.checkArgument(categoria != null, "La categoría es obligatoria");
        Preconditions.checkArgument(subcategoria != null, "La subcategoría es obligatoria");
    }
}
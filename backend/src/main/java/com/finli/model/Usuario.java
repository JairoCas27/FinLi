//Entidades (modelos de base de datos)
//Entidad Usuario

package main.java.com.finli.model;

public class Usuario {
<<<<<<< HEAD
    
=======
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, unique = true, length = 100)
    private String correo;

    @Column(nullable = false, length = 255)
    private String contrasena;

    @Column(nullable = false, length = 50)
    private String nombre;

    @Column(name = "apellido_Paterno", nullable = false, length = 50)
    private String apellidoPaterno;

    @Column(name = "apellido_Materno", nullable = false, length = 50)
    private String apellidoMaterno;

    @Column(nullable = false)
    private Integer edad;

    @ManyToOne(fetch = FetchType.LAZY) 
    @JoinColumn(name = "id_estadoUsuario", nullable = false) 
    private EstadoUsuario estadoUsuario;
>>>>>>> a1f7586 (Funcion Registro de Usuario completado)
}
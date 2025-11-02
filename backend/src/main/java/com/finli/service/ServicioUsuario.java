package com.finli.service;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import com.finli.repository.RepositorioUsuarios;
import com.finli.model.Usuario;
import java.util.List;
import java.util.Optional;

@Service
public class ServicioUsuario {
    @Autowired
    private RepositorioUsuarios repo;

    public List<Usuario> listar() {
        return repo.findAll();
    }

    public Optional<Usuario> obtener(Integer id) {
        return repo.findById(id);
    }

    public Usuario crear(Usuario u) {
        u.setId(null);
        return repo.save(u);
    }

    public Usuario actualizar(Integer id, Usuario datos) {
        return repo.findById(id).map(ex -> {
            ex.setNombre(datos.getNombre());
            ex.setEmail(datos.getEmail());
            ex.setPassword(datos.getPassword());
            ex.setRol(datos.getRol());
            return repo.save(ex);
        }).orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }

    public void eliminar(Integer id) {
        repo.deleteById(id);
    }
}

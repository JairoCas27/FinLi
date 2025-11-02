package com.finli.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.finli.model.Usuario;
import java.util.Optional;

@Repository
public interface RepositorioUsuarios extends JpaRepository<Usuario, Integer> {
	Optional<Usuario> findByEmail(String email);
}

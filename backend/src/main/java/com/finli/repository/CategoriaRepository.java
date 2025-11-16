package com.finli.repository;

import com.finli.model.Categoria;
import com.finli.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query; // 💡 Importación necesaria

import java.util.List;
import java.util.Optional;

public interface CategoriaRepository extends JpaRepository<Categoria, Integer> {
    
    // Método existente para encontrar categorías de un usuario específico
    List<Categoria> findByUsuario(Usuario usuario);
    
    // Método existente para buscar por ID
    Optional<Categoria> findById(Integer id);
    
    // Para encontrar categorías globales (id_usuario IS NULL)
    List<Categoria> findByUsuarioIsNull(); 
    
    // 💡 NUEVO MÉTODO ROBUSTO: Carga categorías base y sus subcategorías en una sola consulta.
    @Query("SELECT c FROM Categoria c LEFT JOIN FETCH c.subcategorias WHERE c.usuario IS NULL")
    List<Categoria> findBaseCategoriesWithSubcategories();
}
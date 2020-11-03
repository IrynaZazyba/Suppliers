package by.itech.lab.supplier.repository;

import by.itech.lab.supplier.domain.Category;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category, Long> {

    @Query("select c from Category c where c.category = :category")
    Optional<Category> findByCategory(@Param("category") final String categoryName);

    @Query("select c from Category c")
    Page<Category> findAllNotDeleted(Pageable pageable);

    @Modifying
    @Query("update Category set deleted = true, deletedAt = :deletedTime where id = :id")
    void deleteById(@Param("id") Long id, @Param("deletedTime") LocalDate deletedTime);

}

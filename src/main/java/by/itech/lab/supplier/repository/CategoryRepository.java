package by.itech.lab.supplier.repository;

import by.itech.lab.supplier.domain.Category;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    Optional<Category> findByCategory(final String categoryName);

    @Query("select c from Category c where :deleted is null or c.deleted=:deleted")
    Page<Category> findAllByDeleted(Pageable pageable, @Param("deleted") Boolean deleted);

    @Modifying
    @Query("update Category set deleted = true where id = :id")
    void deleteById(@Param("id") Long id);

}

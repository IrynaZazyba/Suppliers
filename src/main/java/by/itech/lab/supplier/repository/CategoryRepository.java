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

    @Query("select c from Category c where :active is null or c.active=:active")
    Page<Category> findAllByActive(Pageable pageable, @Param("active") Boolean active);

    @Modifying
    @Query("update Category set active = false where id = :id")
    void delete(@Param("id") Long id);

    @Modifying
    @Query("update Category set active = true where id = :id")
    void activate(@Param("id") Long id);
}

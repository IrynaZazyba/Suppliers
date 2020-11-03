package by.itech.lab.supplier.repository;

import by.itech.lab.supplier.domain.Item;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.Optional;

public interface ItemRepository extends JpaRepository<Item, Long> {

    @Query("select i from Item i where i.label = :label")
    Optional<Item> findByLabel(@Param("label") final String label);

    @Query("select i from Item i where i.category.id=:category_id")
    Page<Item> findAllByCategory(@Param("category_id") Long categoryId, final Pageable page);

    @Query("select i from Item i")
    Page<Item> findAll(Pageable pageable);

    @Modifying
    @Query("update Item set deletedAt = :deletedTime where id = :id")
    void deleteById(@Param("id") Long id, @Param("deletedTime") LocalDate deletedTime);

}

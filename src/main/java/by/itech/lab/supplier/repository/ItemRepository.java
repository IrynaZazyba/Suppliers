package by.itech.lab.supplier.repository;

import by.itech.lab.supplier.domain.Item;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;

@Repository
public interface ItemRepository extends JpaRepository<Item, Long> {

    @Query("select i from Item i where i.label = :label")
    Page<Item> findByLabel(@Param("label") final String label, final Pageable page);

    @Query("select i from Item i where i.category.id=:category_id")
    Page<Item> findAllByCategory(@Param("category_id") Long categoryId, final Pageable page);

    @Modifying
    @Query("update Item set deletedAt = :deletedTime where id = :id")
    void deleteById(@Param("id") Long id, @Param("deletedTime") LocalDate deletedTime);

}

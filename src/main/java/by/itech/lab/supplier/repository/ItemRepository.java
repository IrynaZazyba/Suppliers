package by.itech.lab.supplier.repository;

import by.itech.lab.supplier.domain.Item;
import by.itech.lab.supplier.dto.CategoryDto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ItemRepository extends JpaRepository<Item, Long> {

    Optional<Item> findByLabel(final String label);

    List<Optional<Item>> findByCategory(final CategoryDto categoryDto);

    @Modifying
    @Query("update Item set active = false where id = :id")
    void delete(@Param("id") Long id);

    @Modifying
    @Query("update Item set active = true where id = :id")
    void activate(@Param("id") Long id);

}

package by.itech.lab.supplier.repository;

import by.itech.lab.supplier.domain.Item;
import by.itech.lab.supplier.domain.Retailer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RetailerRepository extends JpaRepository<Retailer, Long> {
    Optional<Retailer> findById(Long id);

    @Modifying
    @Query("update Retailer set deletedAt = current_timestamp where id = :id")
    void delete(@Param("id") Long id);

    Page<Retailer> findAll(Pageable pageable);
}

package by.itech.lab.supplier.repository;

import by.itech.lab.supplier.domain.Customer;
import by.itech.lab.supplier.domain.Item;
import by.itech.lab.supplier.domain.Retailer;
import by.itech.lab.supplier.domain.User;
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

    Page<Retailer> findAllByActiveEquals(Pageable pageable, Boolean active);

    @Query("select r from Retailer r  where :active is null or r.active=:active")
    Page<Retailer> findByStatus(Pageable pageable, @Param("active") Boolean active);
}

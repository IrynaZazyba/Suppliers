package by.itech.lab.supplier.repository;

import by.itech.lab.supplier.domain.Retailer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface RetailerRepository extends JpaRepository<Retailer, Long> {
    @Modifying
    @Query("update Retailer set deletedAt = current_timestamp where id = :id")
    void delete(@Param("id") Long id);

    Page<Retailer> findAll(Pageable pageable);

    Page<Retailer> findAllByActiveEquals(Pageable pageable, Boolean active);

    @Modifying
    @Query("update Retailer set active = :active where id = :id")
    int updateRetailerStatus(@Param("active") Boolean active, @Param("id") Long id);

    @Query("select r from Retailer r  where :active is null or r.active=:active")
    Page<Retailer> findByStatus(Pageable pageable, @Param("active") Boolean active);
}

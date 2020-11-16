package by.itech.lab.supplier.repository;

import by.itech.lab.supplier.domain.Warehouse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface WarehouseRepository extends JpaRepository<Warehouse, Long> {

    @Modifying
    @Query("update Warehouse set deletedAt = current_timestamp where id = :id")
    void delete(@Param("id") Long id);
}

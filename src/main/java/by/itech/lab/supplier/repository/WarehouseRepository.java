package by.itech.lab.supplier.repository;

import by.itech.lab.supplier.domain.Warehouse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface WarehouseRepository extends JpaRepository<Warehouse, Long> {

    @Query("select totalCapacity from Warehouse where id=:warehouseId")
    Double getTotalCapacity(@Param("warehouseId") Long warehouseId);

}

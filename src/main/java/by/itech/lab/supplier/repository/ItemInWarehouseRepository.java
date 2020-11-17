package by.itech.lab.supplier.repository;

import by.itech.lab.supplier.domain.ItemsInWarehouse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface ItemInWarehouseRepository extends JpaRepository<ItemsInWarehouse, Long> {

    @Query("select i from ItemsInWarehouse i where i.item.id=:id and i.warehouse.id=:warehouseId")
    Optional<ItemsInWarehouse> findByItemId(@Param("id") Long id, @Param("warehouseId") Long warehouseId);

    @Query("select i.warehouse.totalCapacity-COALESCE(sum(i.amount*i.item.units),0) " +
            "from ItemsInWarehouse as i where i.warehouse.id=:warehouseId")
    Double getAvailableCapacity(@Param("warehouseId") Long warehouseId);
}

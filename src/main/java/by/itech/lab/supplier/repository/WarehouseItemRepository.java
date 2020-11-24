package by.itech.lab.supplier.repository;

import by.itech.lab.supplier.domain.WarehouseItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface WarehouseItemRepository extends JpaRepository<WarehouseItem, Long>,
        JpaSpecificationExecutor<WarehouseItem> {

    @Query("select i from WarehouseItem i where i.item.id=:id and i.warehouse.id=:warehouseId")
    Optional<WarehouseItem> findByItemId(@Param("id") Long id, @Param("warehouseId") Long warehouseId);

    @Query("select i.warehouse.totalCapacity-COALESCE(sum(i.amount*i.item.units),0) " +
            "from WarehouseItem as i where i.warehouse.id=:warehouseId")
    Double getAvailableCapacity(@Param("warehouseId") Long warehouseId);

    List<WarehouseItem> getWarehouseItemByWarehouseIdAndItemUpcStartsWith(Long id, String upc);

}

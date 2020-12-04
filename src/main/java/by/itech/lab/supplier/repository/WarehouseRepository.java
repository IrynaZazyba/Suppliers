package by.itech.lab.supplier.repository;

import by.itech.lab.supplier.domain.Warehouse;
import by.itech.lab.supplier.domain.WarehouseType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WarehouseRepository extends JpaRepository<Warehouse, Long> {

    @Modifying
    @Query("update Warehouse set deletedAt = current_timestamp where id in :id")
    void delete(@Param("id") List<Long> id);

    @Modifying
    @Query("update Warehouse set deletedAt = current_timestamp where retailerId = :id")
    void deleteByRetailerId(@Param("id") Long id);

    @Query("select totalCapacity from Warehouse where id=:warehouseId")
    Double getTotalCapacity(@Param("warehouseId") Long warehouseId);

    @Query("select w from Warehouse w where w.retailerId=:retailer_id")
    Page<Warehouse> findAllByRetailerId(@Param("retailer_id") Long retailerId, final Pageable page);

    List<Warehouse> findAllByType(WarehouseType warehouseType);

    @Query("select w.id from Warehouse w where w.identifier = :identifier")
    Long findByIdentifier(@Param("identifier") String identifier);
}

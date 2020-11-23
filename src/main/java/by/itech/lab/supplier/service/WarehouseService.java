package by.itech.lab.supplier.service;

import by.itech.lab.supplier.domain.WarehouseType;
import by.itech.lab.supplier.dto.ApplicationDto;
import by.itech.lab.supplier.dto.ApplicationItemDto;
import by.itech.lab.supplier.dto.WarehouseDto;
import by.itech.lab.supplier.dto.WarehouseItemDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Set;

public interface WarehouseService extends BaseService<WarehouseDto> {

    Page<WarehouseDto> findAll(Pageable pageable);

    List<WarehouseDto> findAllByType(WarehouseType warehouseType);

    void acceptApplication(ApplicationDto appDto, Long warehouseId);

    void acceptItems(Set<ApplicationItemDto> itemsToAccept, ApplicationDto appFromDb);

    Double getAvailableCapacity(Long warehouseId);

    List<WarehouseItemDto> getWarehouseItemsByUpc(Long id, String itemUpc);
}

package by.itech.lab.supplier.service;

import by.itech.lab.supplier.dto.ApplicationDto;
import by.itech.lab.supplier.dto.WarehouseDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface WarehouseService extends BaseService<WarehouseDto> {

    Page<WarehouseDto> findAll(Pageable pageable);

    void acceptItems(ApplicationDto applicationDto, Long warehouseId);

    Double getAvailableCapacity(Long warehouseId);

    void removeItemFromWarehouse(List<ApplicationDto> applicationDto);
}

package by.itech.lab.supplier.service;

import by.itech.lab.supplier.dto.WarehouseDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface WarehouseService extends BaseService<WarehouseDto> {

    Page<WarehouseDto> findAll(Pageable pageable);
}

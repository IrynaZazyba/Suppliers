package by.itech.lab.supplier.service.impl;

import by.itech.lab.supplier.dto.WarehouseDto;
import by.itech.lab.supplier.dto.mapper.WarehouseMapper;
import by.itech.lab.supplier.exception.NotFoundInDBException;
import by.itech.lab.supplier.repository.WarehouseRepository;
import by.itech.lab.supplier.service.WarehouseService;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class WarehouseServiceImpl implements WarehouseService {

    private final WarehouseRepository warehouseRepository;
    private final WarehouseMapper warehouseMapper;

    @Override
    public Page<WarehouseDto> findAllByActive(Pageable pageable, Boolean active) {
        return warehouseRepository.findAll(pageable).map(warehouseMapper::map);
    }

    @Override
    public WarehouseDto findById(Long warehouseId) {
        return warehouseRepository.findById(warehouseId).map(warehouseMapper::map)
                .orElseThrow(NotFoundInDBException::new);
    }

    // TODO: 10/30/20
    @Override
    public WarehouseDto save(WarehouseDto dto) {
        return null;
    }

    // TODO: 10/30/20
    @Override
    public void delete(Long id) {

    }

    // TODO: 10/30/20
    @Override
    public void activate(Long id) {

    }
}

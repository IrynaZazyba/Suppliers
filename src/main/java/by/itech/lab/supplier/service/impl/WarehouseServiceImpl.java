package by.itech.lab.supplier.service.impl;

import by.itech.lab.supplier.domain.Warehouse;
import by.itech.lab.supplier.dto.WarehouseDto;
import by.itech.lab.supplier.dto.mapper.WarehouseMapper;
import by.itech.lab.supplier.exception.ResourceNotFoundException;
import by.itech.lab.supplier.repository.WarehouseRepository;
import by.itech.lab.supplier.service.UserService;
import by.itech.lab.supplier.service.WarehouseService;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@AllArgsConstructor
public class WarehouseServiceImpl implements WarehouseService {

    private final WarehouseRepository warehouseRepository;
    private final WarehouseMapper warehouseMapper;
    private final UserService userService;

    @Override
    public Page<WarehouseDto> findAll(final Pageable pageable) {
        return warehouseRepository.findAll(pageable).map(warehouseMapper::map);
    }

    @Override
    public WarehouseDto findById(final Long warehouseId) {
        return warehouseRepository.findById(warehouseId).map(warehouseMapper::map)
                .orElseThrow(() -> new ResourceNotFoundException("Warehouse with id=" + warehouseId + " doesn't exist"));
    }

    @Override
    @Transactional
    public WarehouseDto save(final WarehouseDto warehouseDto) {
        Warehouse warehouse = Optional.ofNullable(warehouseDto.getId())
                .map(item -> update(warehouseDto))
                .orElseGet(() -> create(warehouseDto));
        return warehouseMapper.map(warehouse);
    }

    private Warehouse create(final WarehouseDto warehouseDto) {
        Warehouse warehouse = warehouseMapper.map(warehouseDto);
        Warehouse saved = warehouseRepository.save(warehouse);
        userService.setWarehouseIntoUser(saved, warehouseDto.getUsersId());
        return saved;
    }

    private Warehouse update(final WarehouseDto warehouseDto) {
        Warehouse warehouse = warehouseRepository.findById(warehouseDto.getId()).orElseThrow();
        warehouseMapper.map(warehouseDto, warehouse);
        return warehouseRepository.save(warehouse);
    }

    @Transactional
    @Override
    public void delete(final Long id) {
        warehouseRepository.delete(id);
    }
}

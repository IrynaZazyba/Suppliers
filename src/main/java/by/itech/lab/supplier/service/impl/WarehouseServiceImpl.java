package by.itech.lab.supplier.service.impl;

import by.itech.lab.supplier.auth.domain.UserImpl;
import by.itech.lab.supplier.domain.Customer;
import by.itech.lab.supplier.domain.Warehouse;
import by.itech.lab.supplier.dto.WarehouseDto;
import by.itech.lab.supplier.dto.mapper.CustomerMapper;
import by.itech.lab.supplier.dto.mapper.WarehouseMapper;
import by.itech.lab.supplier.exception.ResourceNotFoundException;
import by.itech.lab.supplier.repository.WarehouseRepository;
import by.itech.lab.supplier.service.WarehouseService;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Optional;

@Service
@AllArgsConstructor
public class WarehouseServiceImpl implements WarehouseService {

    private final WarehouseRepository warehouseRepository;
    private final WarehouseMapper warehouseMapper;
    private final CustomerMapper customerMapper;

    @Override
    public Page<WarehouseDto> findAll(Pageable pageable) {
        return warehouseRepository.findAll(pageable).map(warehouseMapper::map);
    }

    @Override
    public WarehouseDto findById(Long warehouseId) {
        return warehouseRepository.findById(warehouseId).map(warehouseMapper::map)
                .orElseThrow(() -> new ResourceNotFoundException("Warehouse with id=" + warehouseId + " doesn't exist"));
    }

    @Transactional
    @Override
    public WarehouseDto save(WarehouseDto warehouseDto) {
        Warehouse warehouse = Optional.ofNullable(warehouseDto.getId())
                .map(item -> {
                    final Warehouse existing = warehouseRepository
                            .findById(warehouseDto.getId())
                            .orElseThrow();
                    warehouseMapper.map(warehouseDto, existing);
                    return existing;
                })
                .orElseGet(() -> warehouseMapper.map(warehouseDto));

        UserImpl userImpl = (UserImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        warehouse.setCustomer(customerMapper.map(userImpl.getCustomer().get(0)));
        final Warehouse saved = warehouseRepository.save(warehouse);
        return warehouseMapper.map(saved);
    }

    @Transactional
    @Override
    public void delete(final Long id) {
        warehouseRepository.delete(id);
    }
}

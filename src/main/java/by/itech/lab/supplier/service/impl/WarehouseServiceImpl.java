package by.itech.lab.supplier.service.impl;

import by.itech.lab.supplier.domain.Customer;
import by.itech.lab.supplier.domain.Warehouse;
import by.itech.lab.supplier.dto.WarehouseDto;
import by.itech.lab.supplier.dto.mapper.WarehouseMapper;
import by.itech.lab.supplier.exception.ResourceNotFoundException;
import by.itech.lab.supplier.repository.CustomerRepository;
import by.itech.lab.supplier.repository.WarehouseRepository;
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
    private final CustomerRepository customerRepository;
    private final WarehouseMapper warehouseMapper;

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
    public WarehouseDto save(Long customerId, WarehouseDto warehouseDto) {
        Warehouse warehouse = Optional.ofNullable(warehouseDto.getId())
                .map(item -> {
                    final Warehouse existing = warehouseRepository
                            .findById(warehouseDto.getId())
                            .orElseThrow();
                    warehouseMapper.map(warehouseDto, existing);
                    return existing;
                })
                .orElseGet(() -> warehouseMapper.map(warehouseDto));

        Optional<Customer> customer = customerRepository.findById(customerId);
        customer.ifPresent(warehouse::setCustomer);
        final Warehouse saved = warehouseRepository.save(warehouse);
        return warehouseMapper.map(saved);
    }

    @Transactional
    @Override
    public void delete(final Long id) {
        warehouseRepository.delete(id);
    }

    @Override
    public WarehouseDto save(WarehouseDto dto) {
        return null;
    }
}

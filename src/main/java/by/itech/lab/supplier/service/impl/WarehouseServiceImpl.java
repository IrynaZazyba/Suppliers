package by.itech.lab.supplier.service.impl;

import by.itech.lab.supplier.domain.Warehouse;
import by.itech.lab.supplier.dto.WarehouseDto;
import by.itech.lab.supplier.dto.mapper.WarehouseMapper;
import by.itech.lab.supplier.exception.NotFoundInDBException;
import by.itech.lab.supplier.repository.WarehouseRepository;
import by.itech.lab.supplier.service.WarehouseService;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Optional;

@Service
@AllArgsConstructor
public class WarehouseServiceImpl implements WarehouseService {

    private final WarehouseRepository warehouseRepository;
    private final WarehouseMapper warehouseMapper;

    @Transactional
    @Override
    public WarehouseDto save(WarehouseDto warehouseDto) {
        Warehouse customer = Optional.ofNullable(warehouseDto.getId())
                .map(item -> {
                    final Warehouse existing = warehouseRepository
                            .findById(warehouseDto.getId())
                            .orElseThrow();
                    warehouseMapper.map(warehouseDto, existing);
                    return existing;
                })
                .orElseGet(() -> warehouseMapper.map(warehouseDto));

        final Warehouse saved = warehouseRepository.save(customer);
        return warehouseMapper.map(saved);
    }

    @Override
    public Page<WarehouseDto> findAllByActive(Pageable pageable, Boolean active) {
        return null;
    }

    @Override
    public WarehouseDto findById(Long id) {
        return null;
    }

    @Transactional
    @Override
    public void delete(final Long id) {
        warehouseRepository.delete(id, LocalDate.now());
    }
}

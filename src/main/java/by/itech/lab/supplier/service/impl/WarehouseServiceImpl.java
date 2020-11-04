package by.itech.lab.supplier.service.impl;

import by.itech.lab.supplier.service.WarehouseService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class WarehouseServiceImpl implements WarehouseService {

    @Override
    public WarehouseDto findById(Long warehouseId) {
        return warehouseRepository.findById(warehouseId).map(warehouseMapper::map)
                .orElseThrow(NotFoundInDBException::new);
    }

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

    @Transactional
    @Override
    public void delete(final Long id) {
        warehouseRepository.delete(id, LocalDate.now());
    }

}

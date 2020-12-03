package by.itech.lab.supplier.service;

import by.itech.lab.supplier.domain.WarehouseType;
import by.itech.lab.supplier.dto.ApplicationDto;
import by.itech.lab.supplier.dto.ApplicationItemDto;
import by.itech.lab.supplier.dto.WarehouseDto;
import by.itech.lab.supplier.dto.WarehouseItemDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Set;

import java.util.List;

public interface WarehouseService{

    WarehouseDto save(final WarehouseDto warehouseDto);

    WarehouseDto findById(final Long warehouseId);

    void delete(final List<Long> id);

    Page<WarehouseDto> findAll(Pageable pageable);

    List<WarehouseDto> findAllByType(WarehouseType warehouseType);

    void acceptApplication(ApplicationDto appDto, Long warehouseId);

    void acceptItems(Set<ApplicationItemDto> itemsToAccept, ApplicationDto appFromDb);

    Double getAvailableCapacity(Long warehouseId);

    List<WarehouseItemDto> getWarehouseItemsByUpc(Long id, String itemUpc);

    void deleteByRetailerId(final Long id);

    Page<WarehouseDto> findByRetailerId(final Long retailerId, final Pageable pageable);

    void shipItemsAccordingApplications(List<ApplicationDto> applicationDto);

    List<WarehouseItemDto> getWarehouseItemContainingItems(Long warehouseId, List<Long> itemId);
}

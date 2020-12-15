package by.itech.lab.supplier.service;

import by.itech.lab.supplier.domain.WarehouseType;
import by.itech.lab.supplier.dto.ApplicationDto;
import by.itech.lab.supplier.dto.ApplicationItemDto;
import by.itech.lab.supplier.dto.WarehouseDto;
import by.itech.lab.supplier.dto.WarehouseItemDto;
import by.itech.lab.supplier.dto.WriteOffActDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Set;

public interface WarehouseService {

    Boolean isWarehouseWithIdentifierExist(final String identifier);

    WarehouseDto save(final WarehouseDto warehouseDto);

    WarehouseDto findById(final Long warehouseId);

    Boolean deleteByIds(final List<Long> id);

    Page<WarehouseDto> findAll(Pageable pageable);

    List<WarehouseDto> findAllByType(WarehouseType warehouseType, Boolean byUser);

    void acceptApplication(ApplicationDto appDto, Long warehouseId);

    void acceptItems(Set<ApplicationItemDto> itemsToAccept, ApplicationDto appFromDb);

    Double getAvailableCapacity(Long warehouseId);

    List<WarehouseItemDto> getWarehouseItemsByUpc(Long id, String itemUpc);

    void deleteByRetailerId(final Long id);

    Set<WarehouseDto> findByRetailerId(final Long retailerId);

    void shipItemsAccordingApplications(List<ApplicationDto> applicationDto);

    Page<WarehouseItemDto> getItemsByWarehouseId(Long warehouseId, Pageable pageable);

    List<WarehouseItemDto> getWarehouseItemContainingItems(Long warehouseId, List<Long> itemId);

    List<WarehouseDto> getWarehouseByTypeAndIdentifier(String identifier, WarehouseType warehouseType);

    List<WarehouseDto> getWarehousesWithOpenApplications();

    void writeOffItems(WriteOffActDto writeOffActDto);
}

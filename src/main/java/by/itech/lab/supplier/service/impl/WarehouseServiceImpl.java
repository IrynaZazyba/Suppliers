package by.itech.lab.supplier.service.impl;

import by.itech.lab.supplier.domain.ApplicationStatus;
import by.itech.lab.supplier.domain.Warehouse;
import by.itech.lab.supplier.domain.WarehouseItem;
import by.itech.lab.supplier.dto.ApplicationDto;
import by.itech.lab.supplier.dto.ApplicationItemDto;
import by.itech.lab.supplier.dto.WarehouseDto;
import by.itech.lab.supplier.dto.mapper.ItemMapper;
import by.itech.lab.supplier.dto.mapper.WarehouseMapper;
import by.itech.lab.supplier.exception.ConflictWithTheCurrentWarehouseStateException;
import by.itech.lab.supplier.exception.ResourceNotFoundException;
import by.itech.lab.supplier.repository.WarehouseItemRepository;
import by.itech.lab.supplier.repository.WarehouseRepository;
import by.itech.lab.supplier.service.ApplicationService;
import by.itech.lab.supplier.service.WarehouseService;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class WarehouseServiceImpl implements WarehouseService {

    private final WarehouseRepository warehouseRepository;
    private final WarehouseMapper warehouseMapper;
    private final ItemMapper itemMapper;
    private final ApplicationService applicationService;
    private final WarehouseItemRepository itemInWarehouseRepository;
    private final Lock lock = new ReentrantLock();

    @Override
    public Page<WarehouseDto> findAll(Pageable pageable) {
        return warehouseRepository.findAll(pageable).map(warehouseMapper::map);
    }

    @Override
    public WarehouseDto findById(Long warehouseId) {
        return warehouseRepository.findById(warehouseId).map(warehouseMapper::map)
                .orElseThrow(() -> new ResourceNotFoundException("Warehouse with id=" + warehouseId + " doesn't exist"));
    }

    // TODO: 11/4/20
    @Override
    public WarehouseDto save(WarehouseDto dto) {
        return null;
    }

    // TODO: 11/4/20
    @Override
    public void delete(Long id) {

    }

    @Override
    @Transactional
    public void acceptItems(final ApplicationDto appDto, final Long warehouseId) {
        lock.lock();
        try {
            final ApplicationDto appFromDb = applicationService.findById(appDto.getId());
            final Long appId = appFromDb.getId();
            applicationService.changeStatus(appId, ApplicationStatus.STARTED_PROCESSING);
            final Long destinationLocationId = appFromDb.getDestinationLocationDto().getId();
            if (!destinationLocationId.equals(warehouseId)) {
                throw new AccessDeniedException("Application doesn't belong to the requested warehouse");
            }
            final Set<ApplicationItemDto> acceptedToWarehouse = getItemsToAccept(appDto.getItems(), appId);

            checkWarehouseCapacity(acceptedToWarehouse, destinationLocationId);
            acceptToWarehouse(acceptedToWarehouse, destinationLocationId);
            if (applicationService.isApplicationFullySatisfied(appId)) {
                applicationService.changeStatus(appId, ApplicationStatus.FINISHED_PROCESSING);
            }
        } finally {
            lock.unlock();
        }
    }

    @Override
    public Double getAvailableCapacity(final Long warehouseId) {
        final Double availableCapacity = itemInWarehouseRepository.getAvailableCapacity(warehouseId);
        return Objects.isNull(availableCapacity) ?
                warehouseRepository.getTotalCapacity(warehouseId)
                : availableCapacity;
    }

    private Set<ApplicationItemDto> getItemsToAccept(final Set<ApplicationItemDto> itemsToAccept,
                                                     final Long appId) {
        final List<Long> acceptedItemInAppId = itemsToAccept
                .stream()
                .map(ApplicationItemDto::getId)
                .collect(Collectors.toList());
        final Set<ApplicationItemDto> acceptedItemFromDb = applicationService
                .getItemsById(acceptedItemInAppId, appId);
        if (acceptedItemFromDb.size() != itemsToAccept.size()) {
            throw new ConflictWithTheCurrentWarehouseStateException("Attempt to accept doesn't exist or already accepted item");
        }
        return acceptedItemFromDb;
    }

    private void acceptToWarehouse(final Set<ApplicationItemDto> itemsToAccept,
                                   final Long warehouseId) {
        final List<Long> acceptedIds = new ArrayList<>();
        for (ApplicationItemDto itemToAccept : itemsToAccept) {
            final Long itemId = itemToAccept.getItemDto().getId();
            final Optional<WarehouseItem> iiw = itemInWarehouseRepository.findByItemId(itemId, warehouseId);
            final WarehouseItem itemsInWarehouse = iiw.map(
                    items -> updateItemInWarehouse(items, itemToAccept))
                    .orElseGet(() -> createItemInWarehouse(warehouseId, itemToAccept));
            acceptedIds.add(itemToAccept.getId());
            itemInWarehouseRepository.save(itemsInWarehouse);
        }
        applicationService.setItemInApplicationAcceptedAt(acceptedIds);
    }

    private WarehouseItem updateItemInWarehouse(final WarehouseItem itemsInWarehouse,
                                                final ApplicationItemDto itemsInApplication) {
        itemsInWarehouse.setAmount(itemsInWarehouse.getAmount() + itemsInApplication.getAmount());
        final BigDecimal existingCost = itemsInWarehouse.getCost();
        final BigDecimal newCost = itemsInApplication.getCost();
        itemsInWarehouse.setCost(existingCost.compareTo(newCost) >= 0 ? existingCost : newCost);
        return itemsInWarehouse;
    }

    private WarehouseItem createItemInWarehouse(final Long warehouseId,
                                                final ApplicationItemDto itemsInApplication) {
        final Warehouse warehouse = Warehouse.builder().id(warehouseId).build();
        return WarehouseItem.builder()
                .item(itemMapper.map(itemsInApplication.getItemDto()))
                .amount(itemsInApplication.getAmount())
                .cost(itemsInApplication.getCost())
                .warehouse(warehouse)
                .build();
    }

    private void checkWarehouseCapacity(final Set<ApplicationItemDto> acceptedToWarehouse,
                                        final Long destinationLocationId) {
        final Double capacityApp = applicationService.getCapacityItemInApplication(acceptedToWarehouse);
        if (getAvailableCapacity(destinationLocationId) < capacityApp) {
            throw new ConflictWithTheCurrentWarehouseStateException("Warehouse capacity not allow to accept items");
        }
    }

}

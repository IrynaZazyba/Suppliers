package by.itech.lab.supplier.service.impl;

import by.itech.lab.supplier.domain.ApplicationStatus;
import by.itech.lab.supplier.domain.ItemsInWarehouse;
import by.itech.lab.supplier.domain.Warehouse;
import by.itech.lab.supplier.dto.ApplicationDto;
import by.itech.lab.supplier.dto.ItemsInApplicationDto;
import by.itech.lab.supplier.dto.WarehouseDto;
import by.itech.lab.supplier.dto.mapper.ItemMapper;
import by.itech.lab.supplier.dto.mapper.WarehouseMapper;
import by.itech.lab.supplier.exception.ConflictWithTheCurrentStateException;
import by.itech.lab.supplier.exception.ResourceNotFoundException;
import by.itech.lab.supplier.repository.ItemInWarehouseRepository;
import by.itech.lab.supplier.repository.WarehouseRepository;
import by.itech.lab.supplier.service.ApplicationService;
import by.itech.lab.supplier.service.WarehouseService;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
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
    private final ItemInWarehouseRepository itemInWarehouseRepository;
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
    public void acceptItems(final ApplicationDto appDto) {
        //todo think about warehouseId
        lock.lock();
        try {
            applicationService.changeStatus(appDto.getId(), ApplicationStatus.STARTED_PROCESSING);
            final ApplicationDto appFromDb = applicationService.findById(appDto.getId());
            final Set<ItemsInApplicationDto> acceptedToWarehouse = getItemsToAccept(appDto.getItems(), appDto.getId());

            final Double capacityApp = applicationService.getCapacityItemInApplication(acceptedToWarehouse);
            if (getAvailableCapacity(4L) < capacityApp) {
                throw new ConflictWithTheCurrentStateException("Warehouse capacity not allow to accept items");
            }
            acceptToWarehouse(acceptedToWarehouse, appFromDb);
            if (applicationService.isApplicationFullySatisfied(appFromDb.getId())) {
                applicationService.changeStatus(appDto.getId(), ApplicationStatus.FINISHED_PROCESSING);
            }
        } finally {
            lock.unlock();
        }
    }

    @Override
    public Double getAvailableCapacity(final Long warehouseId) {
        return itemInWarehouseRepository.getAvailableCapacity(warehouseId);
    }

    private Set<ItemsInApplicationDto> getItemsToAccept(final Set<ItemsInApplicationDto> itemToAccept,
                                                        final Long appId) {
        final List<Long> acceptedItemInAppId = itemToAccept
                .stream().map(ItemsInApplicationDto::getId).collect(Collectors.toList());
        final Set<ItemsInApplicationDto> acceptedItemFromDb = applicationService
                .getItemsById(acceptedItemInAppId, appId);
        if (acceptedItemFromDb.size() != itemToAccept.size()) {
            throw new ConflictWithTheCurrentStateException(
                    "Attempt to accept doesn't exist or already accepted item");
        }
        return acceptedItemFromDb;
    }

    private void acceptToWarehouse(final Set<ItemsInApplicationDto> acceptedToWarehouse,
                                   final ApplicationDto app) {
        final Long warehouseId = app.getDestinationLocationDto().getId();
        acceptedToWarehouse.forEach(itemToAccept -> {
            final Long itemId = itemToAccept.getItemDto().getId();
            final Optional<ItemsInWarehouse> iiw = itemInWarehouseRepository.findByItemId(itemId, warehouseId);
            final ItemsInWarehouse itemsInWarehouse = iiw.map(
                    items -> updateItemInWarehouse(items, itemToAccept))
                    .orElseGet(() -> createItemInWarehouse(warehouseId, itemToAccept));
            itemToAccept.setAcceptedAt(LocalDate.now());
            itemInWarehouseRepository.save(itemsInWarehouse);
        });
        //todo save itemInApplication acceptedAt
        //applicationService.saveItemInApplication(acceptedToWarehouse);
    }

    private ItemsInWarehouse updateItemInWarehouse(final ItemsInWarehouse itemsInWarehouse,
                                                   final ItemsInApplicationDto itemsInApplication) {
        itemsInWarehouse.setAmount(itemsInWarehouse.getAmount() + itemsInApplication.getAmount());
        itemsInWarehouse.setCost(
                itemsInWarehouse.getCost().compareTo(itemsInApplication.getCost()) >= 0 ?
                        itemsInWarehouse.getCost() :
                        itemsInApplication.getCost());
        return itemsInWarehouse;
    }

    private ItemsInWarehouse createItemInWarehouse(final Long warehouseId,
                                                   final ItemsInApplicationDto itemsInApplication) {
        return ItemsInWarehouse.builder()
                .item(itemMapper.map(itemsInApplication.getItemDto()))
                .amount(itemsInApplication.getAmount())
                .cost(itemsInApplication.getCost())
                .warehouse(Warehouse.builder().id(warehouseId).build())
                .build();
    }

}

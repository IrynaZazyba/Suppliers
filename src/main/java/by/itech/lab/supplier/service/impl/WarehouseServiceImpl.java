package by.itech.lab.supplier.service.impl;

import by.itech.lab.supplier.auth.domain.UserImpl;
import by.itech.lab.supplier.domain.ApplicationStatus;
import by.itech.lab.supplier.domain.Warehouse;
import by.itech.lab.supplier.domain.WarehouseItem;
import by.itech.lab.supplier.domain.WarehouseType;
import by.itech.lab.supplier.dto.ApplicationDto;
import by.itech.lab.supplier.dto.ApplicationItemDto;
import by.itech.lab.supplier.dto.UserDto;
import by.itech.lab.supplier.dto.WarehouseDto;
import by.itech.lab.supplier.dto.WarehouseItemDto;
import by.itech.lab.supplier.dto.mapper.ItemMapper;
import by.itech.lab.supplier.dto.mapper.WarehouseItemMapper;
import by.itech.lab.supplier.dto.mapper.WarehouseMapper;
import by.itech.lab.supplier.exception.ConflictWithTheCurrentWarehouseStateException;
import by.itech.lab.supplier.exception.ResourceNotFoundException;
import by.itech.lab.supplier.repository.WarehouseItemRepository;
import by.itech.lab.supplier.repository.WarehouseRepository;
import by.itech.lab.supplier.repository.filter.WarehouseItemFilter;
import by.itech.lab.supplier.service.ApplicationService;
import by.itech.lab.supplier.service.UserService;
import by.itech.lab.supplier.service.WarehouseService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WarehouseServiceImpl implements WarehouseService {

    private final WarehouseRepository warehouseRepository;
    private final WarehouseMapper warehouseMapper;
    private final ItemMapper itemMapper;
    private final ApplicationService applicationService;
    private final WarehouseItemRepository itemInWarehouseRepository;
    private final Lock lock = new ReentrantLock();
    private final UserService userService;
    private final WarehouseItemMapper warehouseItemMapper;
    private final WarehouseItemFilter warehouseItemFilter;

    @Lazy
    @Autowired
    private WarehouseService _self;

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
    public List<WarehouseDto> findAllByType(final WarehouseType warehouseType, final Boolean byUser) {
        if (warehouseType == WarehouseType.WAREHOUSE && Objects.nonNull(byUser) && byUser) {
            UserImpl principal = (UserImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            UserDto currentUser = userService.findById(principal.getId());
            return Collections.singletonList(currentUser.getWarehouseDto());
        }
        return warehouseRepository.findAllByType(warehouseType)
                .stream().map(warehouseMapper::map).collect(Collectors.toList());
    }

    @Override
    public Page<WarehouseDto> findByRetailerId(final Long retailerId, final Pageable pageable) {
        return warehouseRepository.findAllByRetailerId(retailerId, pageable).map(warehouseMapper::map);
    }

    @Override
    public Boolean isWarehouseWithIdentifierExist(final String identifier) {
        Long id = warehouseRepository.findWarehouseIdByIdentifier(identifier);
        return id != null;
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
        userService.setWarehouseIntoUser(saved, warehouseDto.getDispatchersId());
        return saved;
    }

    private Warehouse update(final WarehouseDto warehouseDto) {
        Warehouse warehouse = warehouseRepository.findById(warehouseDto.getId()).orElseThrow();
        warehouseMapper.map(warehouseDto, warehouse);
        Warehouse saved = warehouseRepository.save(warehouse);
        userService.setWarehouseIntoUser(saved, warehouseDto.getDispatchersId());
        userService.deleteWarehouseFromUsers(warehouseDto.getIrrelevantDispatchersId());
        return saved;
    }

    @Transactional
    @Override
    public void deleteByIds(final List<Long> id) {
        warehouseRepository.deleteByIds(id);
        userService.deleteWarehousesForAllUsers(id);
    }

    @Transactional
    @Override
    public void deleteByRetailerId(final Long id) {
        warehouseRepository.deleteByRetailerId(id);
    }

    @Override
    public void acceptApplication(final ApplicationDto appDto, final Long warehouseId) {
        lock.lock();
        try {
            final ApplicationDto appFromDb = applicationService.findById(appDto.getId());
            ApplicationStatus applicationStatus = appFromDb.getApplicationStatus();
            if (applicationStatus != ApplicationStatus.OPEN
                    && applicationStatus != ApplicationStatus.STARTED_PROCESSING) {
                throw new ConflictWithTheCurrentWarehouseStateException("Application couldn't be accepted");
            }
            final Long destinationLocationId = appFromDb.getDestinationLocationDto().getId();
            if (!destinationLocationId.equals(warehouseId)) {
                throw new AccessDeniedException("Application doesn't belong to the requested warehouse");
            }
            _self.acceptItems(appDto.getItems(), appFromDb);
        } finally {
            lock.unlock();
        }
    }

    @Override
    @Transactional
    public void acceptItems(final Set<ApplicationItemDto> itemsToAccept, final ApplicationDto appFromDb) {
        final Long appId = appFromDb.getId();
        final Long destinationLocationId = appFromDb.getDestinationLocationDto().getId();
        final Set<ApplicationItemDto> acceptedToWarehouse = getItemsToAccept(itemsToAccept, appId);

        if (isWarehouseFull(acceptedToWarehouse, destinationLocationId)) {
            throw new ConflictWithTheCurrentWarehouseStateException("Warehouse capacity not allow to accept items");
        }
        acceptToWarehouse(acceptedToWarehouse, destinationLocationId);
        final ApplicationStatus status = applicationService.isApplicationFullySatisfied(appId) ?
                ApplicationStatus.FINISHED_PROCESSING :
                ApplicationStatus.STARTED_PROCESSING;
        applicationService.changeStatus(appId, status);
    }

    @Override
    public Double getAvailableCapacity(final Long warehouseId) {
        final Double availableCapacity = itemInWarehouseRepository.getAvailableCapacity(warehouseId);
        return Objects.isNull(availableCapacity) ?
                warehouseRepository.getTotalCapacity(warehouseId) :
                availableCapacity;
    }

    @Override
    public List<WarehouseItemDto> getWarehouseItemsByUpc(final Long id, final String itemUpc) {
        return itemInWarehouseRepository
                .getWarehouseItemByWarehouseIdAndItemUpcStartsWith(id, itemUpc)
                .stream()
                .map(warehouseItemMapper::map)
                .collect(Collectors.toList());
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
            throw new ConflictWithTheCurrentWarehouseStateException(
                    "Attempt to accept doesn't exist or already accepted item");
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

    private boolean isWarehouseFull(final Set<ApplicationItemDto> acceptedToWarehouse,
                                    final Long destinationLocationId) {
        final Double capacityApp = applicationService.getCapacityItemInApplication(acceptedToWarehouse);
        return getAvailableCapacity(destinationLocationId) < capacityApp;
    }

    @Override
    @Transactional
    public void shipItemsAccordingApplications(List<ApplicationDto> applicationsDto) {
        final Map<Long, Map<Long, WarehouseItem>> whItemByWhAndItem = findOnlyRelatedItems(applicationsDto);
        final List<WarehouseItem> warehouseItems = applicationsDto.stream().map(app -> app.getItems().stream()
                .map(appItem -> reduceItemAmount(appItem, whItemByWhAndItem
                        .get(app.getDestinationLocationDto().getId())
                        .get(appItem.getItemDto().getId())))
                .collect(Collectors.toList())
        ).flatMap(Collection::stream).collect(Collectors.toList());
        itemInWarehouseRepository.saveAll(warehouseItems);
    }

    private Map<Long, Map<Long, WarehouseItem>> findOnlyRelatedItems(final List<ApplicationDto> apps) {
        return itemInWarehouseRepository.findAll(warehouseItemFilter.buildSearchSpecification(apps)).stream()
                // mapping by warehouse id
                .collect(Collectors.groupingBy(item -> item.getWarehouse().getId(),
                        // mapping by item id
                        Collectors.toMap(item -> item.getItem().getId(), Function.identity())));
    }

    private WarehouseItem reduceItemAmount(final ApplicationItemDto item,
                                           final WarehouseItem itemInWarehouse) {
        if (Objects.isNull(itemInWarehouse)) {
            throw new ConflictWithTheCurrentWarehouseStateException(
                    "Warehouse doesn't have item with id=" + item.getItemDto().getId());
        }
        final Double amountAtWarehouse = itemInWarehouse.getAmount();
        final Double amountAfterReducing = amountAtWarehouse - item.getAmount();
        if (amountAfterReducing < 0) {
            throw new ConflictWithTheCurrentWarehouseStateException(
                    "Required amount of items bigger than existing at warehouse");
        }
        itemInWarehouse.setAmount(amountAfterReducing);
        return itemInWarehouse;
    }

    @Override
    public List<WarehouseItemDto> getWarehouseItemContainingItems(Long warehouseId, List<Long> itemId) {
        return itemInWarehouseRepository
                .getWarehouseItemByWarehouseIdAndItemIdIn(warehouseId, itemId)
                .stream()
                .map(warehouseItemMapper::map)
                .collect(Collectors.toList());
    }
}

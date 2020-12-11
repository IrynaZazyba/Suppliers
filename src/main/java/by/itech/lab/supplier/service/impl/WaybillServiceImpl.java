package by.itech.lab.supplier.service.impl;

import by.itech.lab.supplier.auth.domain.UserImpl;
import by.itech.lab.supplier.domain.Car;
import by.itech.lab.supplier.domain.User;
import by.itech.lab.supplier.domain.WayBill;
import by.itech.lab.supplier.domain.WayPoint;
import by.itech.lab.supplier.domain.WaybillStatus;
import by.itech.lab.supplier.dto.ApplicationDto;
import by.itech.lab.supplier.dto.WayBillDto;
import by.itech.lab.supplier.dto.mapper.ApplicationMapper;
import by.itech.lab.supplier.dto.mapper.UserMapper;
import by.itech.lab.supplier.dto.mapper.WayBillMapper;
import by.itech.lab.supplier.exception.ResourceNotFoundException;
import by.itech.lab.supplier.exception.ValidationException;
import by.itech.lab.supplier.exception.domain.ValidationErrors;
import by.itech.lab.supplier.repository.WaybillRepository;
import by.itech.lab.supplier.service.ApplicationService;
import by.itech.lab.supplier.service.CalculationService;
import by.itech.lab.supplier.service.CarService;
import by.itech.lab.supplier.service.UserService;
import by.itech.lab.supplier.service.WarehouseService;
import by.itech.lab.supplier.service.WaybillService;
import by.itech.lab.supplier.service.validation.WaybillValidationService;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class WaybillServiceImpl implements WaybillService {

    private final WaybillRepository waybillRepository;
    private final WayBillMapper wayBillMapper;
    private final UserMapper userMapper;
    private final UserService userService;
    private final ApplicationService applicationService;
    private final CalculationService calculationService;
    private final WaybillValidationService waybillValidationService;
    private final ApplicationMapper applicationMapper;
    private final WarehouseService warehouseService;
    private final CarService carService;

    @Transactional
    @Override
    public WayBillDto save(final WayBillDto wayBillDto) {
        final UserImpl principal = (UserImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        final User user = userMapper.map(userService.findById(principal.getId()));
        final List<ApplicationDto> apps = getRelatedApplications(wayBillDto);
        final WayBill wayBill = Optional.ofNullable(wayBillDto.getId())
                .map(itemToSave -> updateWayBill(wayBillDto))
                .orElseGet(() -> createWayBill(wayBillDto, user));

        final ValidationErrors validationResult = validateWaybill(wayBill, apps);
        if (validationResult.getValidationMessages().size() > 0) {
            throw new ValidationException("Invalid waybill data", validationResult);
        }

        wayBill.setLastUpdated(LocalDateTime.now());
        wayBill.setUpdatedByUsers(user);
        wayBill.setCustomerId(user.getCustomer().getId());
        wayBill.getRoute().getWayPoints().forEach(waypoint -> waypoint.setRoute(wayBill.getRoute()));
        final WayBill saved = waybillRepository.save(wayBill);

        if (Objects.isNull(wayBillDto.getId())) {
            final List<ApplicationDto> appDtos = apps.stream().peek(app -> app.setWayBillId(saved.getId()))
                    .collect(Collectors.toList());
            applicationService.saveAll(appDtos);
        }
        return wayBillMapper.map(saved);

    }

    private WayBill createWayBill(final WayBillDto wayBillDto, final User user) {
        final WayBill wayBill = wayBillMapper.map(wayBillDto);
        wayBill.setRegistrationDate(LocalDateTime.now());
        wayBill.setCreatedByUsers(user);
        wayBill.setWaybillStatus(WaybillStatus.READY);
        return wayBill;
    }

    private WayBill updateWayBill(final WayBillDto wayBillDto) {
        final WayBill existing = waybillRepository.findById(wayBillDto.getId()).orElseThrow();
        wayBillMapper.map(wayBillDto, existing);
        return existing;
    }

    private List<ApplicationDto> getRelatedApplications(final WayBillDto wayBillDto) {
        final List<Long> appsIds = wayBillDto.getApplications().stream()
                .map(ApplicationDto::getId)
                .collect(Collectors.toList());
        return applicationService.getApplicationsByIds(appsIds);
    }

    private ValidationErrors validateWaybill(final WayBill wayBill, final List<ApplicationDto> apps) {
        final List<ApplicationDto> updatedApps = wayBill.getApplications()
                .stream()
                .filter(app -> Objects.nonNull(app.getWayBill()))
                .map(applicationMapper::map)
                .collect(Collectors.toList());
        final List<ApplicationDto> waybillApps = Objects.isNull(wayBill.getId()) ? apps : updatedApps;
        return waybillValidationService.validateWaybill(wayBill, waybillApps);
    }

    @Override
    public Optional<WayBillDto> getWaybillByNumber(String number) {
        return waybillRepository.findByNumber(number).map(wayBillMapper::map);
    }

    @Override
    public WayBillDto findById(final Long id) {
        return Optional.ofNullable(waybillRepository.getOne(id))
                .map(wayBillMapper::map)
                .orElseThrow(() -> new ResourceNotFoundException("No waybill with id=" + id + "exists"));
    }

    @Override
    public Page<WayBillDto> findAll(final Pageable pageable, final WaybillStatus status) {
        UserImpl user = (UserImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        GrantedAuthority grantedAuthority = user.getAuthorities().stream().findFirst().orElseThrow();
        Page<WayBill> allByRoleAndStatus = waybillRepository
                .findAllByRoleAndStatus(pageable, status, user.getId(), grantedAuthority.getAuthority());
        return allByRoleAndStatus.map(wayBillMapper::map);
    }


    @Override
    @Transactional
    public WayBillDto startWaybillDelivery(final Long waybillId) {
        final WayBill wayBill = waybillRepository.findById(waybillId).orElseThrow();
        final List<ApplicationDto> apps = wayBill.getApplications()
                .stream().map(applicationMapper::map).collect(Collectors.toList());
        warehouseService.shipItemsAccordingApplications(apps);
        final Double appsCapacity = apps.stream().map(app ->
                applicationService.getCapacityItemInApplication(app.getItems()))
                .reduce(0.0, Double::sum);

        wayBill.setWaybillStatus(WaybillStatus.IN_PROGRESS);
        wayBill.setDeliveryStart(LocalDateTime.now());
        final Car car = wayBill.getCar();
        car.setOnTheWay(true);
        car.setCurrentCapacity(car.getTotalCapacity() - appsCapacity);
        waybillRepository.save(wayBill);
        return wayBillMapper.map(wayBill);
    }

    @Override
    @Transactional
    public WaybillStatus completeWaybillDelivery(final Long waybillId) {
        final WayBill wayBill = waybillRepository.findById(waybillId).orElseThrow();
        wayBill.setWaybillStatus(WaybillStatus.FINISHED);
        final Car car = wayBill.getCar();
        final Map<Integer, WayPoint> mappedByPriority = wayBill.getRoute().getWayPoints().stream()
                .collect(Collectors.toMap(WayPoint::getPriority, Function.identity()));
        final Integer maxPriority = Collections.max(mappedByPriority.keySet());
        car.setAddress(mappedByPriority.get(maxPriority).getAddress());
        car.setOnTheWay(false);
        car.setCurrentCapacity(car.getTotalCapacity());
        waybillRepository.save(wayBill);
        return wayBill.getWaybillStatus();
    }

}

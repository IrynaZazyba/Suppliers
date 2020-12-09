package by.itech.lab.supplier.service.impl;

import by.itech.lab.supplier.auth.domain.UserImpl;
import by.itech.lab.supplier.domain.User;
import by.itech.lab.supplier.domain.WayBill;
import by.itech.lab.supplier.domain.WaybillStatus;
import by.itech.lab.supplier.dto.ApplicationDto;
import by.itech.lab.supplier.dto.RouteDto;
import by.itech.lab.supplier.dto.WarehouseDto;
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
import by.itech.lab.supplier.service.UserService;
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
import java.util.List;
import java.util.Objects;
import java.util.Optional;
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

    @Transactional
    public WayBillDto save(final WayBillDto wayBillDto) {
        final UserImpl principal = (UserImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        final User user = userMapper.map(userService.findById(principal.getId()));

        final WayBill wayBill = Optional.ofNullable(wayBillDto.getId())
                .map(itemToSave -> updateWayBill(wayBillDto))
                .orElseGet(() -> createWayBill(wayBillDto, user));

        final List<ApplicationDto> apps = getRelatedApplications(wayBillDto);
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
    public RouteDto calculateWaybillRoute(final List<Long> appsIds) {
        final List<ApplicationDto> applicationsByIds = applicationService.getApplicationsByIds(appsIds);
        final List<WarehouseDto> warehouses = applicationsByIds
                .stream()
                .map(ApplicationDto::getDestinationLocationDto)
                .collect(Collectors.toList());
        return calculationService.calculateOptimalRoute(warehouses, applicationsByIds.get(0).getSourceLocationDto());
    }


}

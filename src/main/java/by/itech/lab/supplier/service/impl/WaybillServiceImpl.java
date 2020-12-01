package by.itech.lab.supplier.service.impl;

import by.itech.lab.supplier.auth.domain.UserImpl;
import by.itech.lab.supplier.domain.Application;
import by.itech.lab.supplier.domain.User;
import by.itech.lab.supplier.domain.WayBill;
import by.itech.lab.supplier.domain.WaybillStatus;
import by.itech.lab.supplier.dto.ApplicationDto;
import by.itech.lab.supplier.dto.WayBillDto;
import by.itech.lab.supplier.dto.mapper.ApplicationMapper;
import by.itech.lab.supplier.dto.mapper.UserMapper;
import by.itech.lab.supplier.dto.mapper.WayBillMapper;
import by.itech.lab.supplier.repository.WaybillRepository;
import by.itech.lab.supplier.service.ApplicationService;
import by.itech.lab.supplier.service.UserService;
import by.itech.lab.supplier.service.WaybillService;
import lombok.AllArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
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
    private final ApplicationMapper applicationMapper;

    @Transactional
    public WayBillDto save(final WayBillDto wayBillDto) {
        final UserImpl principal = (UserImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        final User user = userMapper.map(userService.findById(principal.getId()));

        final WayBill wayBill = Optional.ofNullable(wayBillDto.getId())
                .map(itemToSave -> updateWayBill(wayBillDto, user))
                .orElseGet(() -> createWayBill(wayBillDto, user));
        return wayBillMapper.map(wayBill);
    }

    private WayBill createWayBill(final WayBillDto wayBillDto, final User user) {
        final WayBill wayBill = wayBillMapper.map(wayBillDto);
        wayBill.setRegistrationDate(LocalDateTime.now());
        wayBill.setCreatedByUsers(user);
        wayBill.setWaybillStatus(WaybillStatus.READY);
        wayBill.setLastUpdated(LocalDateTime.now());
        wayBill.setUpdatedByUsers(user);
        wayBill.setCustomerId(user.getCustomer().getId());
        final WayBill saved = waybillRepository.save(wayBill);
        final List<Application> relatedApplications = getRelatedApplications(wayBillDto);
        List<ApplicationDto> appDtos = relatedApplications
                .stream().peek(a -> a.setWayBill(saved)).map(applicationMapper::map)
                .collect(Collectors.toList());
        applicationService.saveAll(appDtos);
        return wayBill;
    }


    private WayBill updateWayBill(final WayBillDto wayBillDto, User user) {
        final WayBill existing = waybillRepository
                .findById(wayBillDto.getId())
                .orElseThrow();
        wayBillMapper.map(wayBillDto, existing);
        existing.setLastUpdated(LocalDateTime.now());
        existing.setUpdatedByUsers(user);
        existing.setCustomerId(user.getCustomer().getId());
        wayBillMapper.mapApplications(existing, wayBillDto);
        return waybillRepository.save(existing);
    }

    private List<Application> getRelatedApplications(final WayBillDto wayBillDto) {
        final List<Long> appsIds = wayBillDto.getApplications().stream()
                .map(ApplicationDto::getId)
                .collect(Collectors.toList());
        return applicationService.getApplicationsByIds(appsIds)
                .stream().map(applicationMapper::map).collect(Collectors.toList());
    }

}

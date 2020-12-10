package by.itech.lab.supplier.dto.mapper;

import by.itech.lab.supplier.domain.Application;
import by.itech.lab.supplier.domain.WayBill;
import by.itech.lab.supplier.dto.ApplicationDto;
import by.itech.lab.supplier.dto.WayBillDto;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.function.Function;
import java.util.stream.Collectors;


@Component
@AllArgsConstructor
public class WayBillMapper implements BaseMapper<WayBill, WayBillDto> {

    private final WarehouseMapper warehouseMapper;
    private final CarMapper carMapper;
    private final UserMapper userMapper;
    private final ApplicationMapper applicationMapper;
    private final RouteMapper routeMapper;

    @Override
    public WayBill map(final WayBillDto dto) {
        return WayBill.builder()
                .id(dto.getId())
                .number(dto.getNumber())
                .waybillStatus(dto.getWaybillStatus())
                .registrationDate(dto.getRegistrationDate())
                .lastUpdated(dto.getLastUpdated())
                .sourceLocationWarehouse(warehouseMapper.map(dto.getSourceLocationWarehouseDto()))
                .car(carMapper.map(dto.getCar()))
                .driver(userMapper.map(dto.getDriver()))
                .applications(dto.getApplications().stream().map(applicationMapper::map).collect(Collectors.toList()))
                .route(Objects.nonNull(dto.getRoute()) ? routeMapper.map(dto.getRoute()) : null)
                .deliveryStart(Objects.nonNull(dto.getDeliveryStart()) ? dto.getDeliveryStart() : null)
                .build();
    }

    @Override
    public WayBillDto map(final WayBill wayBill) {
        return WayBillDto.builder()
                .id(wayBill.getId())
                .number(wayBill.getNumber())
                .waybillStatus(wayBill.getWaybillStatus())
                .registrationDate(wayBill.getRegistrationDate())
                .lastUpdated(wayBill.getLastUpdated())
                .createdByUsersDto(userMapper.map(wayBill.getCreatedByUsers()))
                .updatedByUsersDto(userMapper.map(wayBill.getUpdatedByUsers()))
                .sourceLocationWarehouseDto(warehouseMapper.map(wayBill.getSourceLocationWarehouse()))
                .car(carMapper.map(wayBill.getCar()))
                .driver(userMapper.map(wayBill.getDriver()))
                .applications(wayBill.getApplications().stream().map(applicationMapper::map).collect(Collectors.toList()))
                .route(Objects.nonNull(wayBill.getRoute()) ? routeMapper.map(wayBill.getRoute()) : null)
                .deliveryStart(Objects.nonNull(wayBill.getDeliveryStart()) ? wayBill.getDeliveryStart() : null)
                .build();
    }

    public void map(final WayBillDto from, final WayBill to) {
        to.setNumber(Objects.nonNull(from.getNumber()) ? from.getNumber() : to.getNumber());
        to.setSourceLocationWarehouse(Objects.nonNull(from.getSourceLocationWarehouseDto())
                ? warehouseMapper.map(from.getSourceLocationWarehouseDto()) : to.getSourceLocationWarehouse());
        to.setDriver(Objects.nonNull(from.getDriver()) ? userMapper.map(from.getDriver()) : to.getDriver());
        to.setRoute(Objects.nonNull(from.getRoute()) ? routeMapper.map(from.getRoute()) : to.getRoute());
        mapApplications(to, from);
    }

    private void mapApplications(final WayBill wayBill,
                                 final WayBillDto wayBillDto) {
        final List<ApplicationDto> applications = wayBillDto.getApplications();
        final Map<Long, ApplicationDto> mappedByAppId = applications.stream()
                .collect(Collectors.toMap(ApplicationDto::getId, Function.identity()));
        wayBill.getApplications().forEach(e -> {
            final ApplicationDto appDto = mappedByAppId.get(e.getId());
            if (appDto.isDeleteFromWaybill()) {
                e.setWayBill(null);
            } else {
                e.setWayBill(wayBill);
            }
        });
        final List<Application> newApplications = applications.stream()
                .filter(app -> Objects.isNull(app.getWayBillId()))
                .peek(app -> app.setWayBillId(wayBill.getId()))
                .map(applicationMapper::map).collect(Collectors.toList());
        wayBill.getApplications().addAll(newApplications);
    }

}

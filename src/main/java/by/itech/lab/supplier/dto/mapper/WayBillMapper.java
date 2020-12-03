package by.itech.lab.supplier.dto.mapper;

import by.itech.lab.supplier.domain.WayBill;
import by.itech.lab.supplier.dto.ApplicationDto;
import by.itech.lab.supplier.dto.WayBillDto;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

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

    @Override
    public WayBill map(final WayBillDto dto) {
        return WayBill.builder()
                .id(dto.getId())
                .number(dto.getNumber())
                .waybillStatus(dto.getWaybillStatus())
                .registrationDate(dto.getRegistrationDate())
                .lastUpdated(dto.getLastUpdated())
                .sourceLocationWarehouse(warehouseMapper.map(dto.getSourceLocationWarehouseDto()))
                .car(carMapper.map(dto.getCarDto()))
                .driver(userMapper.map(dto.getDriverDto()))
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
                .carDto(carMapper.map(wayBill.getCar()))
                .driverDto(userMapper.map(wayBill.getDriver()))
                .applications(wayBill.getApplications().stream()
                        .map(applicationMapper::map).collect(Collectors.toList()))
                .build();
    }

    public void map(final WayBillDto from, final WayBill to) {
        to.setNumber(Objects.nonNull(from.getNumber()) ? from.getNumber() : to.getNumber());
        to.setSourceLocationWarehouse(Objects.nonNull(from.getSourceLocationWarehouseDto())
                ? warehouseMapper.map(from.getSourceLocationWarehouseDto()) : to.getSourceLocationWarehouse());
        to.setDriver(Objects.nonNull(from.getDriverDto()) ? userMapper.map(from.getDriverDto()) : to.getDriver());
    }


    public void mapApplications(final WayBill wayBill,
                                final WayBillDto wayBillDto) {
        final Map<Long, ApplicationDto> mappedByAppId = wayBillDto.getApplications()
                .stream().collect(Collectors.toMap(ApplicationDto::getId, Function.identity()));
        wayBill.getApplications().forEach(e -> {
            final ApplicationDto appDto = mappedByAppId.get(e.getId());
            if (appDto.isDeleteFromWaybill()) {
                e.setWayBill(null);
            } else {
                e.setWayBill(wayBill);
            }
        });
    }


}

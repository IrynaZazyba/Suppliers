package by.itech.lab.supplier.dto.mapper;

import by.itech.lab.supplier.domain.WayBill;
import by.itech.lab.supplier.dto.WayBillDto;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;


@Component
@AllArgsConstructor
public class WayBillMapper implements BaseMapper<WayBill, WayBillDto> {

    private final AddressMapper addressMapper;
    private final CarMapper carMapper;
    private final UserMapper userMapper;

    @Override
    public WayBill map(final WayBillDto dto) {
        return WayBill.builder()
                .id(dto.getId())
                .number(dto.getNumber())
                .waybillStatus(dto.getWaybillStatus())
                .registrationDate(dto.getRegistrationDate())
                .lastUpdated(dto.getLastUpdated())
                .createdByUsers(userMapper.map(dto.getCreatedByUsersDto()))
                .updatedByUsers(userMapper.map(dto.getUpdatedByUsersDto()))
                .sourceLocationAddress(addressMapper.map(dto.getSourceLocationAddressDto()))
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
                .sourceLocationAddressDto(addressMapper.map(wayBill.getSourceLocationAddress()))
                .carDto(carMapper.map(wayBill.getCar()))
                .driverDto(userMapper.map(wayBill.getDriver()))
                .build();
    }
}

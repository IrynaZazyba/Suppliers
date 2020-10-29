package by.itech.lab.supplier.dto.mapper;

import by.itech.lab.supplier.domain.Application;
import by.itech.lab.supplier.dto.ApplicationDto;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;


@Component
@AllArgsConstructor
public class ApplicationMapper implements BaseMapper<Application, ApplicationDto> {

    private AddressMapper addressMapper;

    private UserMapper userMapper;

    private WayBillMapper wayBillMapper;

    @Override
    public Application map(final ApplicationDto dto) {
        return Application.builder()
          .id(dto.getId())
          .applicationStatus(dto.getApplicationStatus())
          .number(dto.getNumber())
          .registrationDate(dto.getRegistrationDate())
          .lastUpdated(dto.getLastUpdated())
          .sourceLocationAddressId(addressMapper.map(dto.getSourceLocationAddressIdDto()))
          .createdByUsers(userMapper.map(dto.getCreatedByUsersDto()))
          .lastUpdatedByUsers(userMapper.map(dto.getLastUpdatedByUsersDto()))
          .wayBill(wayBillMapper.map(dto.getWayBillDto()))
          .build();
    }

    @Override
    public ApplicationDto map(final Application application) {
        return ApplicationDto.builder()
          .id(application.getId())
          .applicationStatus(application.getApplicationStatus())
          .number(application.getNumber())
          .registrationDate(application.getRegistrationDate())
          .lastUpdated(application.getLastUpdated())
          .sourceLocationAddressIdDto(addressMapper.map(application.getSourceLocationAddressId()))
          .createdByUsersDto(userMapper.map(application.getCreatedByUsers()))
          .lastUpdatedByUsersDto(userMapper.map(application.getLastUpdatedByUsers()))
          .wayBillDto(wayBillMapper.map(application.getWayBill()))
          .build();
    }
}

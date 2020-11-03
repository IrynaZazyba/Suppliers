package by.itech.lab.supplier.dto.mapper;

import by.itech.lab.supplier.domain.Application;
import by.itech.lab.supplier.dto.ApplicationDto;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;


@Component
@AllArgsConstructor
public class ApplicationMapper implements BaseMapper<Application, ApplicationDto> {

    private final AddressMapper addressMapper;

    private final UserMapper userMapper;

    private final WayBillMapper wayBillMapper;

    private final ItemMapper itemMapper;

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
          .deleted(dto.isDeleted())
          .deletedAt(dto.getDeletedAt())
          .items(dto.getItems().stream().map(itemMapper::map).collect(Collectors.toSet()))
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
          .deleted(application.isDeleted())
          .deletedAt(application.getDeletedAt())
          .items(application.getItems().stream().map(itemMapper::map).collect(Collectors.toSet()))
          .build();
    }

    public void map(final ApplicationDto from, final Application to) {
        to.setApplicationStatus(from.getApplicationStatus());
        to.setNumber(from.getNumber());
        to.setRegistrationDate(from.getRegistrationDate());
        to.setLastUpdated(from.getLastUpdated());
        to.setSourceLocationAddressId(addressMapper.map(from.getSourceLocationAddressIdDto()));
        to.setCreatedByUsers(userMapper.map(from.getCreatedByUsersDto()));
        to.setLastUpdatedByUsers(userMapper.map(from.getLastUpdatedByUsersDto()));
        to.setWayBill(wayBillMapper.map(from.getWayBillDto()));
        to.setDeleted(from.isDeleted());
        to.setDeletedAt(from.getDeletedAt());
        to.setItems(from.getItems().stream().map(itemMapper::map).collect(Collectors.toSet()));
    }
}

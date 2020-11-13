package by.itech.lab.supplier.dto.mapper;

import by.itech.lab.supplier.domain.Application;
import by.itech.lab.supplier.domain.ApplicationItem;
import by.itech.lab.supplier.dto.ApplicationDto;
import by.itech.lab.supplier.dto.ItemsInApplicationDto;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

@Component
@AllArgsConstructor
public class ApplicationMapper implements BaseMapper<Application, ApplicationDto> {

    private final AddressMapper addressMapper;
    private final UserMapper userMapper;
    private final WayBillMapper wayBillMapper;
    private final ItemsInApplicationMapper itemsInApplicationMapper;
    private final ItemMapper itemMapper;

    @Override
    public Application map(final ApplicationDto dto) {
        final Application application = Application.builder()
                .id(dto.getId())
                .applicationStatus(dto.getApplicationStatus())
                .number(dto.getNumber())
                .registrationDate(dto.getRegistrationDate())
                .lastUpdated(dto.getLastUpdated())
                .sourceLocationAddress(addressMapper.map(dto.getSourceLocationAddressDto()))
                .destinationLocationAddress(addressMapper.map(dto.getDestinationLocationAddressDto()))
                .createdByUsers(userMapper.map(dto.getCreatedByUsersDto()))
                .lastUpdatedByUsers(userMapper.map(dto.getLastUpdatedByUsersDto()))
                .deletedAt(dto.getDeletedAt())
                .items(dto.getItems().stream().map(itemsInApplicationMapper::map).collect(Collectors.toSet()))
                .build();
        if (Objects.nonNull(dto.getWayBillDto())) {
            application.setWayBill(wayBillMapper.map(dto.getWayBillDto()));
        }
        return application;
    }

    @Override
    public ApplicationDto map(final Application application) {
        final ApplicationDto applicationDto = ApplicationDto.builder()
                .id(application.getId())
                .applicationStatus(application.getApplicationStatus())
                .number(application.getNumber())
                .registrationDate(application.getRegistrationDate())
                .lastUpdated(application.getLastUpdated())
                .sourceLocationAddressDto(addressMapper.map(application.getSourceLocationAddress()))
                .destinationLocationAddressDto(addressMapper.map(application.getDestinationLocationAddress()))
                .createdByUsersDto(userMapper.map(application.getCreatedByUsers()))
                .lastUpdatedByUsersDto(userMapper.map(application.getLastUpdatedByUsers()))
                .deletedAt(application.getDeletedAt())
                .items(application.getItems().stream().map(itemsInApplicationMapper::map).collect(Collectors.toSet()))
                .build();
        if (Objects.nonNull(application.getWayBill())) {
            applicationDto.setWayBillDto(wayBillMapper.map(application.getWayBill()));
        }
        return applicationDto;
    }

    public void map(final ApplicationDto from, final Application to) {
        to.setApplicationStatus(from.getApplicationStatus());
        to.setNumber(from.getNumber());
        to.setRegistrationDate(from.getRegistrationDate());
        to.setLastUpdated(from.getLastUpdated());
        to.setSourceLocationAddress(addressMapper.map(from.getSourceLocationAddressDto()));
        to.setDestinationLocationAddress(addressMapper.map(from.getDestinationLocationAddressDto()));
        to.setCreatedByUsers(userMapper.map(from.getCreatedByUsersDto()));
        to.setLastUpdatedByUsers(userMapper.map(from.getLastUpdatedByUsersDto()));
        to.setDeletedAt(from.getDeletedAt());
        updateItems(to.getItems(), from.getItems());
        if (Objects.nonNull(from.getWayBillDto())) {
            to.setWayBill(wayBillMapper.map(from.getWayBillDto()));
        }
    }

    public Application mapItems(final Application application) {
        for (ApplicationItem item : application.getItems()) {
            item.setApplication(application);
        }
        return application;
    }

    private void updateItems(Set<ApplicationItem> forUpdate, Set<ItemsInApplicationDto> update) {
        for (ItemsInApplicationDto item : update) {
            ApplicationItem result = forUpdate.stream()
                    .filter(Objects::nonNull)
                    .filter(p -> p.getId().equals(item.getId()))
                    .findAny()
                    .orElse(null);
            if (Objects.nonNull(result)) {
                result.setAmount(item.getAmount());
                result.setCost(item.getCost());
                result.setDeletedAt(item.getDeletedAt());
                result.setItem(itemMapper.map(item.getItemDto()));
            } else {
                forUpdate.add(itemsInApplicationMapper.map(item));
            }
        }
    }

}

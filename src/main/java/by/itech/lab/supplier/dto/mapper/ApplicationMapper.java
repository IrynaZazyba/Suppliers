package by.itech.lab.supplier.dto.mapper;

import by.itech.lab.supplier.domain.Application;
import by.itech.lab.supplier.domain.ApplicationItem;
import by.itech.lab.supplier.dto.ApplicationDto;
import by.itech.lab.supplier.dto.ApplicationItemDto;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

@Component
@AllArgsConstructor
public class ApplicationMapper implements BaseMapper<Application, ApplicationDto> {

    private final WarehouseMapper warehouseMapper;
    private final UserMapper userMapper;
    private final WayBillMapper wayBillMapper;
    private final ApplicationItemMapper itemsInApplicationMapper;
    private final ItemMapper itemMapper;

    @Override
    public Application map(final ApplicationDto dto) {
        return Application.builder()
                .id(dto.getId())
                .applicationStatus(dto.getApplicationStatus())
                .number(dto.getNumber())
                .registrationDate(dto.getRegistrationDate())
                .lastUpdated(dto.getLastUpdated())
                .sourceLocationAddress(Objects.nonNull(dto.getSourceLocationDto()) ? warehouseMapper
                        .map(dto.getSourceLocationDto()) : null)
                .destinationLocationAddress(Objects.nonNull(dto.getDestinationLocationDto()) ? warehouseMapper
                        .map(dto.getDestinationLocationDto()) : null)
                .createdByUsers(Objects.nonNull(dto.getCreatedByUsersDto()) ? userMapper
                        .map(dto.getCreatedByUsersDto()) : null)
                .lastUpdatedByUsers(Objects.nonNull(dto.getLastUpdatedByUsersDto()) ? userMapper
                        .map(dto.getLastUpdatedByUsersDto()) : null)
                .deletedAt(dto.getDeletedAt())
                .items(dto.getItems().stream().map(itemsInApplicationMapper::map).collect(Collectors.toSet()))
                .customerId(dto.getCustomerId())
                .type(dto.getType())
                .wayBill(Objects.nonNull(dto.getWayBillDto()) ? wayBillMapper.map(dto.getWayBillDto()) : null)
                .build();
    }

    @Override
    public ApplicationDto map(final Application entity) {
        return ApplicationDto.builder()
                .id(entity.getId())
                .applicationStatus(entity.getApplicationStatus())
                .number(entity.getNumber())
                .registrationDate(entity.getRegistrationDate())
                .lastUpdated(entity.getLastUpdated())
                .sourceLocationDto(Objects.nonNull(entity.getSourceLocationAddress()) ? warehouseMapper
                        .map(entity.getSourceLocationAddress()) : null)
                .destinationLocationDto(Objects.nonNull(entity.getDestinationLocationAddress()) ? warehouseMapper
                        .map(entity.getDestinationLocationAddress()) : null)
                .createdByUsersDto(Objects.nonNull(entity.getCreatedByUsers()) ? userMapper
                        .map(entity.getCreatedByUsers()) : null)
                .lastUpdatedByUsersDto(Objects.nonNull(entity.getLastUpdatedByUsers()) ? userMapper
                        .map(entity.getLastUpdatedByUsers()) : null)
                .deletedAt(entity.getDeletedAt())
                .items(entity.getItems().stream().map(itemsInApplicationMapper::map).collect(Collectors.toSet()))
                .customerId(entity.getCustomerId())
                .type(entity.getType())
                .wayBillDto(Objects.nonNull(entity.getWayBill()) ? wayBillMapper.map(entity.getWayBill()) : null)
                .build();
    }

    public void map(final ApplicationDto from, final Application to) {
        to.setApplicationStatus(from.getApplicationStatus());
        to.setNumber(from.getNumber());
        to.setLastUpdated(from.getLastUpdated());
        to.setSourceLocationAddress(Objects.nonNull(from.getSourceLocationDto()) ? warehouseMapper
                .map(from.getSourceLocationDto()) : to.getSourceLocationAddress());
        to.setDestinationLocationAddress(Objects.nonNull(from.getDestinationLocationDto()) ? warehouseMapper
                .map(from.getDestinationLocationDto()) : to.getDestinationLocationAddress());
        to.setCreatedByUsers(Objects.nonNull(from.getCreatedByUsersDto()) ? userMapper
                .map(from.getCreatedByUsersDto()) : to.getCreatedByUsers());
        to.setLastUpdatedByUsers(Objects.nonNull(from.getLastUpdatedByUsersDto()) ? userMapper
                .map(from.getLastUpdatedByUsersDto()) : to.getLastUpdatedByUsers());
        to.setWayBill(Objects.nonNull(from.getWayBillDto()) ? wayBillMapper.map(from.getWayBillDto()) : to.getWayBill());
        to.setDeletedAt(from.getDeletedAt());
        to.setCustomerId(from.getCustomerId());
        to.setType(from.getType());
        updateItems(to.getItems(), from.getItems());
    }

    public Application mapItems(final Application application) {
        for (ApplicationItem item : application.getItems()) {
            item.setApplication(application);
        }
        return application;
    }


    private void updateItems(Set<ApplicationItem> forUpdate, Set<ApplicationItemDto> update) {
        for (ApplicationItemDto item : update) {
            ApplicationItem result = forUpdate.stream()
                    .filter(obj -> Objects.nonNull(obj.getId()))
                    .filter(p -> p.getId().equals(item.getId()))
                    .findAny()
                    .orElse(null);

            if (Objects.nonNull(result) && Objects.isNull(item.getDeleted())) {
                result.setAmount(item.getAmount());
                result.setCost(item.getCost());
                result.setAcceptedAt(item.getAcceptedAt());
                result.setItem(itemMapper.map(item.getItemDto()));
            }

            if (Objects.nonNull(result) && Objects.nonNull(item.getDeleted())) {
                forUpdate.remove(result);
            }

            if (Objects.isNull(result)) {
                forUpdate.add(itemsInApplicationMapper.map(item));
            }
        }
    }

}

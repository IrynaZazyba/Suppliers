package by.itech.lab.supplier.dto.mapper;

import by.itech.lab.supplier.domain.WriteOffAct;
import by.itech.lab.supplier.domain.WriteOffItem;
import by.itech.lab.supplier.dto.WriteOffActDto;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Objects;
import java.util.stream.Collectors;

@Component
@AllArgsConstructor
public class WriteOffActMapper implements BaseMapper<WriteOffAct, WriteOffActDto> {

    private WriteOffActReasonMapper reasonMapper;
    private WriteOffItemMapper writeOffItemMapper;

    @Override
    public WriteOffAct map(final WriteOffActDto dto) {
        return WriteOffAct.builder()
                .id(dto.getId())
                .customerId(dto.getCustomerId())
                .date(dto.getDate())
                .deletedAt(dto.getDeletedAt())
                .totalSum(dto.getTotalSum())
                .totalAmount(dto.getTotalAmount())
                .identifier(dto.getIdentifier())
                .items(dto.getItems().stream().map(writeOffItemMapper::map).collect(Collectors.toSet()))
                .creatorId(dto.getCreatorId())
                .warehouseId(dto.getWarehouseId())
                .build();
    }

    @Override
    public WriteOffActDto map(final WriteOffAct entity) {
        return WriteOffActDto.builder()
                .id(entity.getId())
                .customerId(entity.getCustomerId())
                .date(entity.getDate())
                .deletedAt(entity.getDeletedAt())
                .totalSum(entity.getTotalSum())
                .totalAmount(entity.getTotalAmount())
                .identifier(entity.getIdentifier())
                .items(entity.getItems().stream().map(writeOffItemMapper::map).collect(Collectors.toSet()))
                .creatorId(entity.getCreatorId())
                .warehouseId(entity.getWarehouseId())
                .build();
    }

    public WriteOffAct mapItems(final WriteOffAct writeOffAct) {
        for (WriteOffItem item : writeOffAct.getItems()) {
            item.setWriteOffAct(writeOffAct);
        }
        return writeOffAct;
    }
}

package by.itech.lab.supplier.dto.mapper;

import by.itech.lab.supplier.domain.WarehouseItem;
import by.itech.lab.supplier.dto.WarehouseItemDto;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Objects;


@Component
@AllArgsConstructor
public class WarehouseItemMapper implements BaseMapper<WarehouseItem, WarehouseItemDto> {

    private final ItemMapper itemMapper;

    @Override
    public WarehouseItem map(final WarehouseItemDto dto) {
        return WarehouseItem.builder()
                .id(dto.getId())
                .amount(dto.getAmount())
                .cost(dto.getCost())
                .item(Objects.isNull(dto.getItem()) ? null : itemMapper.map(dto.getItem()))
                .build();
    }

    @Override
    public WarehouseItemDto map(final WarehouseItem entity) {
        return WarehouseItemDto.builder()
                .id(entity.getId())
                .amount(entity.getAmount())
                .cost(entity.getCost())
                .item(Objects.isNull(entity.getItem()) ? null : itemMapper.map(entity.getItem()))
                .build();
    }

}

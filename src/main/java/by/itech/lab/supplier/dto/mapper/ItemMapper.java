package by.itech.lab.supplier.dto.mapper;

import by.itech.lab.supplier.domain.Item;
import by.itech.lab.supplier.dto.ItemDto;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@AllArgsConstructor
public class ItemMapper implements BaseMapper<Item, ItemDto> {

    private final CategoryMapper categoryMapper;

    @Override
    public Item map(final ItemDto dto) {
        return Item.builder()
                .id(dto.getId())
                .upc(dto.getUpc())
                .label(dto.getLabel())
                .units(dto.getUnits())
                .category(categoryMapper.map(dto.getCategoryDto()))
                .deletedAt(dto.getDeletedAt())
                .customerId(dto.getCustomerId())
                .build();
    }

    @Override
    public ItemDto map(final Item entity) {
        return ItemDto.builder()
                .id(entity.getId())
                .upc(entity.getUpc())
                .label(entity.getLabel())
                .units(entity.getUnits())
                .categoryDto(categoryMapper.map(entity.getCategory()))
                .deletedAt(entity.getDeletedAt())
                .customerId(entity.getCustomerId())
                .build();
    }

    public void map(final ItemDto from, final Item to) {
        to.setUpc(from.getUpc());
        to.setLabel(from.getLabel());
        to.setUnits(from.getUnits());
        to.setCategory(categoryMapper.map(from.getCategoryDto()));
        to.setDeletedAt(from.getDeletedAt());
        to.setCustomerId(from.getCustomerId());
    }

}

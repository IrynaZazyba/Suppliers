package by.itech.lab.supplier.dto.mapper;

import by.itech.lab.supplier.domain.Item;
import by.itech.lab.supplier.dto.ItemDto;

public class ItemMapper implements BaseMapper<Item, ItemDto> {
    @Override
    public Item map(ItemDto dto) {
        return Item.builder()
          .id(dto.getId())
          .upc(dto.getUpc())
          .label(dto.getLabel())
          .units(dto.getUnits())
          .category(dto.getCategory())
          .active(dto.isActive())
          .build();
    }

    @Override
    public ItemDto map(Item entity) {
        return ItemDto.builder()
          .id(entity.getId())
          .upc(entity.getUpc())
          .label(entity.getLabel())
          .units(entity.getUnits())
          .category(entity.getCategory())
          .active(entity.isActive())
          .build();
    }

    public void update(final ItemDto from, final Item to) {
        to.setUpc(from.getUpc());
        to.setLabel(from.getLabel());
        to.setUnits(from.getUnits());
        to.setCategory(from.getCategory());
        to.setActive(from.isActive());
    }

}

package by.itech.lab.supplier.dto.mapper;

import by.itech.lab.supplier.domain.ItemsInApplication;
import by.itech.lab.supplier.dto.ItemsInApplicationDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;


@Component
public class ItemsInApplicationMapper implements BaseMapper<ItemsInApplication, ItemsInApplicationDto> {

    private final ItemMapper itemMapper;

    @Autowired
    public ItemsInApplicationMapper(final ItemMapper itemMapper) {
        this.itemMapper = itemMapper;
    }

    @Override
    public ItemsInApplication map(final ItemsInApplicationDto dto) {
        return ItemsInApplication.builder()
                .id(dto.getId())
                .amount(dto.getAmount())
                .cost(dto.getCost())
                .item(itemMapper.map(dto.getItemDto()))
                .deletedAt(dto.getDeletedAt())
                .build();
    }

    @Override
    public ItemsInApplicationDto map(final ItemsInApplication entity) {
        return ItemsInApplicationDto.builder()
                .id(entity.getId())
                .amount(entity.getAmount())
                .cost(entity.getCost())
                .itemDto(itemMapper.map(entity.getItem()))
                .deletedAt(entity.getDeletedAt())
                .build();
    }

    public void map(final ItemsInApplicationDto from, final ItemsInApplication to) {
        to.setAmount(from.getAmount());
        to.setCost(from.getCost());
        to.setItem(itemMapper.map(from.getItemDto()));
        to.setDeletedAt(from.getDeletedAt());
    }
}

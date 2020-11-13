package by.itech.lab.supplier.dto.mapper;

import by.itech.lab.supplier.domain.ApplicationItem;
import by.itech.lab.supplier.dto.ItemsInApplicationDto;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;


@Component
@AllArgsConstructor
public class ItemsInApplicationMapper implements BaseMapper<ApplicationItem, ItemsInApplicationDto> {

    private final ItemMapper itemMapper;

    @Override
    public ApplicationItem map(final ItemsInApplicationDto dto) {
        return ApplicationItem.builder()
                .id(dto.getId())
                .amount(dto.getAmount())
                .cost(dto.getCost())
                .item(itemMapper.map(dto.getItemDto()))
                .deletedAt(dto.getDeletedAt())
                .build();
    }

    @Override
    public ItemsInApplicationDto map(final ApplicationItem entity) {
        return ItemsInApplicationDto.builder()
                .id(entity.getId())
                .amount(entity.getAmount())
                .cost(entity.getCost())
                .itemDto(itemMapper.map(entity.getItem()))
                .deletedAt(entity.getDeletedAt())
                .build();
    }

    public void map(final ItemsInApplicationDto from, final ApplicationItem to) {
        to.setAmount(from.getAmount());
        to.setCost(from.getCost());
        to.setItem(itemMapper.map(from.getItemDto()));
        to.setDeletedAt(from.getDeletedAt());
    }
}

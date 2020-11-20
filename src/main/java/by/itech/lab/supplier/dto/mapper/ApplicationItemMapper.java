package by.itech.lab.supplier.dto.mapper;

import by.itech.lab.supplier.domain.ApplicationItem;
import by.itech.lab.supplier.dto.ApplicationItemDto;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;


@Component
@AllArgsConstructor
public class ApplicationItemMapper implements BaseMapper<ApplicationItem, ApplicationItemDto> {

    private final ItemMapper itemMapper;

    @Override
    public ApplicationItem map(final ApplicationItemDto dto) {
        return ApplicationItem.builder()
                .id(dto.getId())
                .amount(dto.getAmount())
                .cost(dto.getCost())
                .item(itemMapper.map(dto.getItemDto()))
                .acceptedAt(dto.getAcceptedAt())
                .build();
    }

    @Override
    public ApplicationItemDto map(final ApplicationItem entity) {
        return ApplicationItemDto.builder()
                .id(entity.getId())
                .amount(entity.getAmount())
                .cost(entity.getCost())
                .itemDto(itemMapper.map(entity.getItem()))
                .acceptedAt(entity.getAcceptedAt())
                .build();
    }

    public void map(final ApplicationItemDto from, final ApplicationItem to) {
        to.setAmount(from.getAmount());
        to.setCost(from.getCost());
        to.setItem(itemMapper.map(from.getItemDto()));
        to.setAcceptedAt(from.getAcceptedAt());
    }
}

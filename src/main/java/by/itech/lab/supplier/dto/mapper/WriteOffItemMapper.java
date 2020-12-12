package by.itech.lab.supplier.dto.mapper;

import by.itech.lab.supplier.domain.WriteOffItem;
import by.itech.lab.supplier.dto.WriteOffItemDto;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Objects;

@Component
@AllArgsConstructor
public class WriteOffItemMapper implements BaseMapper<WriteOffItem, WriteOffItemDto> {
    private ItemMapper itemMapper;
    private WriteOffActReasonMapper writeOffActReasonMapper;

    @Override
    public WriteOffItem map(final WriteOffItemDto dto) {
        return WriteOffItem.builder()
                .id(dto.getId())
                .amount(dto.getAmount())
                .sum(dto.getSum())
                .item(Objects.nonNull(dto.getItemDto()) ? itemMapper.map(dto.getItemDto()) : null)
                .writeOffActReason(Objects.nonNull(dto.getWriteOffActReasonDto())
                        ? writeOffActReasonMapper.map(dto.getWriteOffActReasonDto()) : null)
                .build();
    }

    @Override
    public WriteOffItemDto map(final WriteOffItem entity) {
        return WriteOffItemDto.builder()
                .id(entity.getId())
                .amount(entity.getAmount())
                .sum(entity.getSum())
                .itemDto(Objects.nonNull(entity.getItem()) ? itemMapper.map(entity.getItem()) : null)
                .writeOffActReasonDto(Objects.nonNull(entity.getWriteOffActReason())
                        ? writeOffActReasonMapper.map(entity.getWriteOffActReason()) : null)
                .build();
    }
}

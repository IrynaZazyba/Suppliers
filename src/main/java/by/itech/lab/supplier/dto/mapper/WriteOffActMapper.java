package by.itech.lab.supplier.dto.mapper;

import by.itech.lab.supplier.domain.WriteOffAct;
import by.itech.lab.supplier.dto.WriteOffActDto;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Objects;

@Component
@AllArgsConstructor
public class WriteOffActMapper implements BaseMapper<WriteOffAct, WriteOffActDto> {

    private WriteOffActReasonMapper reasonMapper;

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
                .writeOffActReason(Objects.nonNull(dto.getWriteOffActReasonDto())
                        ? reasonMapper.map(dto.getWriteOffActReasonDto())
                        : null)
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
                .writeOffActReasonDto(Objects.nonNull(entity.getWriteOffActReason())
                        ? reasonMapper.map(entity.getWriteOffActReason())
                        : null)
                .build();
    }
}

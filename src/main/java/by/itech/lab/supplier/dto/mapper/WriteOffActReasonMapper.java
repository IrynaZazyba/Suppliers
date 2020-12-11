package by.itech.lab.supplier.dto.mapper;

import by.itech.lab.supplier.domain.WriteOffActReason;
import by.itech.lab.supplier.dto.WriteOffActReasonDto;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@AllArgsConstructor
public class WriteOffActReasonMapper implements BaseMapper<WriteOffActReason, WriteOffActReasonDto> {
    @Override
    public WriteOffActReason map(final WriteOffActReasonDto dto) {
        return WriteOffActReason.builder()
                .id(dto.getId())
                .reason(dto.getReason())
                .deletedAt(dto.getDeletedAt())
                .build();
    }

    @Override
    public WriteOffActReasonDto map(final WriteOffActReason entity) {
        return WriteOffActReasonDto.builder()
                .id(entity.getId())
                .reason(entity.getReason())
                .deletedAt(entity.getDeletedAt())
                .build();
    }
}

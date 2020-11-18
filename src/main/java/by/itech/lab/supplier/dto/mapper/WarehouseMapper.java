package by.itech.lab.supplier.dto.mapper;

import by.itech.lab.supplier.domain.Warehouse;
import by.itech.lab.supplier.dto.WarehouseDto;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

@AllArgsConstructor
@Component
public class WarehouseMapper implements BaseMapper<Warehouse, WarehouseDto> {

    private final CustomerMapper customerMapper;

    @Override
    public Warehouse map(WarehouseDto dto) {
        return Warehouse.builder()
                .id(dto.getId())
                .identifier(dto.getIdentifier())
                .type(dto.getType())
                .totalCapacity(dto.getTotalCapacity())
                .address(dto.getAddress())
                .customer(dto.getCustomerDto() != null ? customerMapper.map(dto.getCustomerDto()) : null)
                .build();
    }

    @Override
    public WarehouseDto map(Warehouse entity) {
        return WarehouseDto.builder()
                .id(entity.getId())
                .identifier(entity.getIdentifier())
                .type(entity.getType())
                .totalCapacity(entity.getTotalCapacity())
                .address(entity.getAddress())
                .customerDto(entity.getCustomer() != null ? customerMapper.map(entity.getCustomer()) : null)
                .build();
    }
}

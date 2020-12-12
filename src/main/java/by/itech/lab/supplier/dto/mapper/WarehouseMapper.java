package by.itech.lab.supplier.dto.mapper;

import by.itech.lab.supplier.domain.Warehouse;
import by.itech.lab.supplier.dto.WarehouseDto;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Objects;

@AllArgsConstructor
@Component
public class WarehouseMapper implements BaseMapper<Warehouse, WarehouseDto> {

    private final AddressMapper addressMapper;

    @Override
    public Warehouse map(final WarehouseDto dto) {
        return Warehouse.builder()
                .id(dto.getId())
                .identifier(dto.getIdentifier())
                .type(dto.getType())
                .deletedAt(dto.getDeletedAt())
                .totalCapacity(dto.getTotalCapacity())
                .address(!Objects.isNull(dto.getAddressDto()) ? addressMapper.map(dto.getAddressDto()) : null)
                .customerId(dto.getCustomerId())
                .retailerId(dto.getRetailerId())
                .build();
    }

    @Override
    public WarehouseDto map(final Warehouse entity) {
        return WarehouseDto.builder()
                .id(entity.getId())
                .identifier(entity.getIdentifier())
                .type(entity.getType())
                .deletedAt(entity.getDeletedAt())
                .customerId(entity.getCustomerId())
                .totalCapacity(entity.getTotalCapacity())
                .addressDto(!Objects.isNull(entity.getAddress()) ? addressMapper.map(entity.getAddress()) : null)
                .retailerId(entity.getRetailerId())
                .build();
    }

    public void map(final WarehouseDto from, final Warehouse to) {
        to.setType(from.getType());
        to.setDeletedAt(from.getDeletedAt());
        to.setTotalCapacity(from.getTotalCapacity());
        to.setAddress(addressMapper.map(from.getAddressDto()));
    }
}

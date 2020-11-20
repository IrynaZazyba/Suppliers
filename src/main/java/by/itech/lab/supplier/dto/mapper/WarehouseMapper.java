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
    private final CustomerMapper customerMapper;

    @Override
    public Warehouse map(final WarehouseDto dto) {
        return Warehouse.builder()
                .id(dto.getId())
                .identifier(dto.getIdentifier())
                .type(dto.getType())
                .totalCapacity(dto.getTotalCapacity())
                .address(!Objects.isNull(dto.getAddressDto())?addressMapper.map(dto.getAddressDto()):null)
                .customer(customerMapper.map(dto.getCustomerId()))
                .retailerId(dto.getRetailerId())
                .build();
    }

    @Override
    public WarehouseDto map(final Warehouse entity) {
        return WarehouseDto.builder()
                .id(entity.getId())
                .identifier(entity.getIdentifier())
                .type(entity.getType())
                .totalCapacity(entity.getTotalCapacity())
                .addressDto(!Objects.isNull(entity.getAddress())?addressMapper.map(entity.getAddress()):null)
                .retailerId(entity.getRetailerId())
                .build();
    }

    public void map(final WarehouseDto from, final Warehouse to) {
        to.setType(from.getType());
        to.setTotalCapacity(from.getTotalCapacity());
        to.setAddress(addressMapper.map(from.getAddressDto()));
    }
}

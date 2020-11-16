
package by.itech.lab.supplier.dto.mapper;

import by.itech.lab.supplier.domain.Customer;
import by.itech.lab.supplier.domain.Warehouse;
import by.itech.lab.supplier.dto.WarehouseDto;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

@AllArgsConstructor
@Component
public class WarehouseMapper implements BaseMapper<Warehouse, WarehouseDto> {

    private final AddressMapper addressMapper;

    @Override
    public Warehouse map(WarehouseDto dto) {
        return Warehouse.builder()
                .id(dto.getId())
                .identifier(dto.getIdentifier())
                .type(dto.getType())
                .totalCapacity(dto.getTotalCapacity())
                .address(addressMapper.map(dto.getAddressDto()))
                .customer(new Customer())
                .build();
    }

    @Override
    public WarehouseDto map(Warehouse entity) {
        return WarehouseDto.builder()
                .id(entity.getId())
                .identifier(entity.getIdentifier())
                .type(entity.getType())
                .totalCapacity(entity.getTotalCapacity())
                .addressDto(addressMapper.map(entity.getAddress()))
                .build();
    }

    public void map(final WarehouseDto from, final Warehouse to) {
        to.setType(from.getType());
        to.setTotalCapacity(from.getTotalCapacity());
        to.setAddress(addressMapper.map(from.getAddressDto()));
    }
}

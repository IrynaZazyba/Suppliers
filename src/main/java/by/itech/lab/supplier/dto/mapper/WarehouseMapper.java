package by.itech.lab.supplier.dto.mapper;

import by.itech.lab.supplier.domain.Warehouse;
import by.itech.lab.supplier.dto.WarehouseDto;

public class WarehouseMapper implements BaseMapper<Warehouse, WarehouseDto> {

    @Override
    public Warehouse map(WarehouseDto dto) {
        return Warehouse.builder()
                .id(dto.getId())
                .identifier(dto.getIdentifier())
                .type(dto.getType())
                .totalCapacity(dto.getTotalCapacity())
                .address(dto.getAddress())
                .customer(dto.getCustomer())
                .users(dto.getUsers())
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
                .customer(entity.getCustomer())
                .users(entity.getUsers())
                .build();
    }

    public void update(final WarehouseDto from, final Warehouse to) {
        to.setId(from.getId());
        to.setIdentifier(from.getIdentifier());
        to.setType(from.getType());
        to.setTotalCapacity(from.getTotalCapacity());
        to.setAddress(from.getAddress());
        to.setCustomer(from.getCustomer());
        to.setUsers(from.getUsers());
    }
}

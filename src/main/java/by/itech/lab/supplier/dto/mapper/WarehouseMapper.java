
package by.itech.lab.supplier.dto.mapper;

import by.itech.lab.supplier.domain.Warehouse;
import by.itech.lab.supplier.dto.WarehouseDto;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@AllArgsConstructor
@Component
public class WarehouseMapper implements BaseMapper<Warehouse, WarehouseDto> {

    private final CustomerMapper customerMapper;
    private final UserMapper userMapper;

    @Override
    public Warehouse map(WarehouseDto dto) {
        return Warehouse.builder()
                .id(dto.getId())
                .identifier(dto.getIdentifier())
                .type(dto.getType())
                .totalCapacity(dto.getTotalCapacity())
                .address(dto.getAddress())
                .users(dto.getUsersDto().stream().map(userMapper::map).collect(Collectors.toSet()))
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
                .usersDto(entity.getUsers().stream().map(userMapper::map).collect(Collectors.toSet()))
                .build();
    }

    public void map(final WarehouseDto from, final Warehouse to) {
        to.setIdentifier(from.getIdentifier());
        to.setType(from.getType());
        to.setTotalCapacity(from.getTotalCapacity());
        to.setAddress(from.getAddress());
        to.setUsers(from.getUsersDto().stream().map(userMapper::map).collect(Collectors.toSet()));
    }
}
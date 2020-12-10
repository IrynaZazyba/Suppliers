package by.itech.lab.supplier.dto.mapper;

import by.itech.lab.supplier.domain.WayPoint;
import by.itech.lab.supplier.dto.WayPointDto;
import lombok.Builder;
import lombok.Data;
import org.springframework.stereotype.Component;

@Component
@Builder
@Data
public class WayPointMapper implements BaseMapper<WayPoint, WayPointDto> {

    private final AddressMapper addressMapper;

    @Override
    public WayPoint map(WayPointDto dto) {
        return WayPoint.builder()
                .isVisited(dto.isVisited())
                .address(addressMapper.map(dto.getAddress()))
                .priority(dto.getPriority())
                .build();
    }

    @Override
    public WayPointDto map(WayPoint entity) {
        return WayPointDto.builder()
                .isVisited(entity.isVisited())
                .address(addressMapper.map(entity.getAddress()))
                .priority(entity.getPriority())
                .build();
    }
}

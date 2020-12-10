package by.itech.lab.supplier.dto.mapper;

import by.itech.lab.supplier.domain.Route;
import by.itech.lab.supplier.dto.RouteDto;
import lombok.Builder;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
@Builder
public class RouteMapper implements BaseMapper<Route, RouteDto> {

    private final WayPointMapper wayPointMapper;

    @Override
    public Route map(final RouteDto dto) {
        return Route.builder()
                .id(dto.getId())
                .wayPoints(dto.getWayPoints().stream().map(wayPointMapper::map).collect(Collectors.toList()))
                .build();
    }

    @Override
    public RouteDto map(final Route entity) {
        return RouteDto.builder()
                .id(entity.getId())
                .wayPoints(entity.getWayPoints().stream().map(wayPointMapper::map).collect(Collectors.toList()))
                .build();
    }
}

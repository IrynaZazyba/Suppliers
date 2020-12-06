package by.itech.lab.supplier.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Builder
@Data
public class RouteDto implements BaseDto {

    private Long id;
    private List<WayPointDto> wayPoints;

}

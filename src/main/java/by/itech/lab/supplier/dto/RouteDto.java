package by.itech.lab.supplier.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Builder
@Data
public class RouteDto {

    private Long id;
    private List<WayPointDto> wayPoints;
    private WayBillDto wayBillDto;
}

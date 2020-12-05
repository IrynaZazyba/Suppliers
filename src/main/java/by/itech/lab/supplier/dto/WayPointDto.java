package by.itech.lab.supplier.dto;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class WayPointDto implements BaseDto {

    private Long id;
    private AddressDto address;
    private boolean isVisited;
    private int priority;

}

package by.itech.lab.supplier.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ZoneDto implements BaseDto {

    private Long id;
    private String location;

}

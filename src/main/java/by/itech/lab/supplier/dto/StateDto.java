package by.itech.lab.supplier.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class StateDto implements BaseDto {

    private Long id;
    private String state;

}

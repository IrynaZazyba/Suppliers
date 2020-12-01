package by.itech.lab.supplier.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class TaxDto implements BaseDto {

    private Long id;
    private BigDecimal amount;
    private Double percentage;
    private String name;
    private StateDto stateDto;

}

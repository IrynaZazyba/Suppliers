package by.itech.lab.supplier.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class CategoryDto implements BaseDto {

    private Long id;
    private String category;
    private BigDecimal taxRate;
    private boolean active;

}

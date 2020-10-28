package by.itech.lab.supplier.dto;


import by.itech.lab.supplier.domain.Category;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class ItemDto implements BaseDto {

    private Long id;
    private BigDecimal upc;
    private String label;
    private Double units;
    private Category category;
    private boolean active;

}

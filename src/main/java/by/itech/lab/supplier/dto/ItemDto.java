package by.itech.lab.supplier.dto;


import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.sql.Date;

@Data
@Builder
public class ItemDto implements BaseDto {

    private Long id;
    private BigDecimal upc;
    private String label;
    private Double units;
    private CategoryDto categoryDto;
    private boolean deleted;
    private Date deletedAt;

}

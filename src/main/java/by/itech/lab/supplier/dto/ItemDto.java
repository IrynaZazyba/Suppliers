package by.itech.lab.supplier.dto;


import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
public class ItemDto implements BaseDto {

    private Long id;
    private BigDecimal upc;
    private String label;
    private Double units;
    private CategoryDto categoryDto;
    private LocalDate deletedAt;
    private Long customerId;

}

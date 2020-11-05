package by.itech.lab.supplier.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class ItemsInApplicationDto implements BaseDto {
    private Long id;
    private ItemDto itemDto;
    private ApplicationDto applicationDto;
    private BigDecimal cost;
    private Double amount;
}

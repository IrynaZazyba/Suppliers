package by.itech.lab.supplier.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class WarehouseItemDto implements BaseDto {

    private Long id;
    private Double amount;
    private ItemDto item;
    private BigDecimal cost;

}

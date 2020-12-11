package by.itech.lab.supplier.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class WriteOffItemDto implements BaseDto {
    private Long id;
    private WriteOffActDto writeOffActDto;
    private ItemDto itemDto;
    private WriteOffActReasonDto writeOffActReasonDto;
    private BigDecimal sum;
    private double amount;
}

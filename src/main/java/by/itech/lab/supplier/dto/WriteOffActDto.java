package by.itech.lab.supplier.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
public class WriteOffActDto implements BaseDto {
    private Long id;
    private String identifier;
    private BigDecimal totalSum;
    private BigDecimal totalAmount;
    private LocalDate date;
    private WriteOffActReasonDto writeOffActReasonDto;
    private LocalDate deletedAt;
    private Long customerId;
}

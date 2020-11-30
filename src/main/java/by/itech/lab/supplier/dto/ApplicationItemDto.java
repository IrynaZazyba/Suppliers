package by.itech.lab.supplier.dto;

import lombok.Builder;
import lombok.Data;

import javax.validation.constraints.DecimalMin;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
public class ApplicationItemDto implements BaseDto {

    private Long id;
    private ItemDto itemDto;
    private ApplicationDto applicationDto;
    @DecimalMin("1.0")
    private BigDecimal cost;
    @DecimalMin("1.0")
    private Double amount;
    private LocalDate acceptedAt;
    private Boolean deleted;

}

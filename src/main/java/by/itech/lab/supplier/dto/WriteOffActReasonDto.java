package by.itech.lab.supplier.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder
public class WriteOffActReasonDto implements BaseDto {
    private Long id;
    private String reason;
    private LocalDate deletedAt;
}

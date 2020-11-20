package by.itech.lab.supplier.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder
public class RetailerDto implements BaseDto {

    private Long id;
    private String fullName;
    private String identifier;
    private LocalDate deletedAt;
    private Boolean active;
    private Long customerId;
}

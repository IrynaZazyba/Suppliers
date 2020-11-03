package by.itech.lab.supplier.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder
public class CustomerDto implements BaseDto {
    private Long id;
    private String name;
    private LocalDate registrationDate;
    private boolean status;
    private String adminEmail;
}


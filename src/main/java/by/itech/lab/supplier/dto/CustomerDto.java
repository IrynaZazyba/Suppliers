package by.itech.lab.supplier.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder
public class CustomerDto implements DefaultDto {

    private Long id;
    private String name;
    private LocalDate registrationDate;
    private String status;

}

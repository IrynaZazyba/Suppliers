package by.itech.lab.supplier.dto;

import by.itech.lab.supplier.domain.Customer;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder
public class CustomerDto {

    private Long id;
    private String name;
    private LocalDate registrationDate;
    private String status;


    //todo change according to Mapping pattern

    public static CustomerDto toDto(Customer customer){
        return CustomerDto.builder().id(customer.getId())
                .name(customer.getName())
                .registrationDate(customer.getRegistrationDate().toLocalDate())
                .status(customer.getStatus())
                .build();
    }
}

package by.itech.lab.supplier.dto;

import by.itech.lab.supplier.domain.Customer;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class CustomerDto {

    private Long id;
    private String name;
    private Date registrationDate;
    private String status;

    public CustomerDto(Customer customer) {
        this.id = customer.getId();
        this.name = customer.getName();
        this.registrationDate = customer.getRegistrationDate();
        this.status = customer.getStatus();
    }
}
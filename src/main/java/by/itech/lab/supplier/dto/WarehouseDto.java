package by.itech.lab.supplier.dto;

import by.itech.lab.supplier.domain.Address;
import by.itech.lab.supplier.domain.Customer;
import by.itech.lab.supplier.domain.User;
import lombok.Builder;
import lombok.Data;
import javax.validation.constraints.NotBlank;
import java.util.HashSet;
import java.util.Set;

@Data
@Builder
public class WarehouseDto implements BaseDto {
    private int id;
    @NotBlank
    private String identifier;
    @NotBlank
    private String type;
    @NotBlank
    private Double totalCapacity;
    private Address address;
    private Customer customer;
    private Set<User> users = new HashSet<>();
}

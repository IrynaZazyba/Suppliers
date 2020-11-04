package by.itech.lab.supplier.dto;

import by.itech.lab.supplier.domain.Address;
import by.itech.lab.supplier.domain.Customer;
import by.itech.lab.supplier.domain.User;
import lombok.Builder;
import lombok.Data;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.util.HashSet;
import java.util.Set;

@Data
@Builder
public class WarehouseDto implements BaseDto {
    private Long id;
    @Size(min = 1, max = 50, message = "Your identifier should contains at least 1 letter")
    @NotBlank
    private String identifier;
    @Size(min = 1, max = 50, message = "Your type should contains at least 1 letter")
    @NotBlank
    private String type;
    @Size(min = 1, max = 10000, message = "Your totalCapacity shouldn't be empty")
    @NotBlank
    private Double totalCapacity;
    @Size(min = 5, max = 50, message = "Your address should contains at least 5 letters")
    @NotBlank
    private Address address;
    private CustomerDto customerDto;
    private Set<UserDto> usersDto = new HashSet<>();
}

package by.itech.lab.supplier.dto;

import by.itech.lab.supplier.domain.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.time.LocalDate;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class UserDto implements BaseDto {

    private boolean active;
    private LocalDate deletedAt;
    private Long id;
    @NotBlank
    @Size(min = 1, max = 50)
    private String name;
    @NotBlank
    @Size(min = 1, max = 50)
    private String surname;
    private LocalDate birthday;
    @NotBlank
    @Size(min = 1, max = 50)
    private String username;
    @Size(min = 4, max = 150, message = "Password should contain at least 4 characters")
    private String password;
    @Email
    @Size(min = 5, max = 254)
    private String email;
    private Role role;
    private AddressDto addressDto;
    private CustomerDto customerDto;
    private Long customerId;
    private WarehouseDto warehouseDto;
}

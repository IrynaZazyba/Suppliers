package by.itech.lab.supplier.dto;

import by.itech.lab.supplier.domain.Address;
import by.itech.lab.supplier.domain.Application;
import by.itech.lab.supplier.domain.Customer;
import by.itech.lab.supplier.domain.Role;
import by.itech.lab.supplier.domain.Warehouse;
import by.itech.lab.supplier.domain.WayBill;
import com.fasterxml.jackson.annotation.JsonBackReference;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

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
    @NotBlank
    @Size(min = 4, max = 150, message = "Password should contain at least 4 characters")
    private String password;
    @Email
    @Size(min = 5, max = 254)
    private String email;
    private Role role;
    private Address address;
    @JsonBackReference
    private CustomerDto customer;
    private Warehouse warehouse;
    private Set<WayBill> creatorWayBills = new HashSet<>();
    private Set<WayBill> updatorWayBills = new HashSet<>();
    private Set<WayBill> driverWayBills = new HashSet<>();
    private Set<Application> creatorApplications = new HashSet<>();
    private Set<Application> updatorApplications = new HashSet<>();

}

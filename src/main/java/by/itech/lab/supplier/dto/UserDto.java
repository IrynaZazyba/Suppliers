package by.itech.lab.supplier.dto;

import by.itech.lab.supplier.domain.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.apache.catalina.authenticator.Constants;

import javax.persistence.*;
import javax.validation.constraints.*;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import java.time.Instant;
import java.time.LocalDate;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class UserDto implements BaseDto {


    public UserDto(User user) {
        this.id = user.getId();
        this.username = user.getUsername();
        this.name = user.getName();
        this.surname = user.getSurname();
        this.email = user.getEmail();
        this.active = user.isActive();
        this.birthday = user.getBirthday();
        this.role = user.getRole();
        this.address = user.getAddress();
        this.customer = user.getCustomer();
        this.warehouse = user.getWarehouse();
        this.creatorWayBills = user.getCreatorWayBills();
        this.driverWayBills = user.getDriverWayBills();
        this.updatorWayBills = user.getUpdatorWayBills();
        this.updatorApplications = user.getUpdatorApplications();
        this.creatorApplications = user.getCreatorApplications();
    }

    private boolean active;

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
    private String activationKey;
    private Role role;
    private Address address;
    private Customer customer;
    private Warehouse warehouse;
    private Set<WayBill> creatorWayBills = new HashSet<>();
    private Set<WayBill> updatorWayBills = new HashSet<>();
    private Set<WayBill> driverWayBills = new HashSet<>();
    private Set<Application> creatorApplications = new HashSet<>();
    private Set<Application> updatorApplications = new HashSet<>();


}
package by.itech.lab.supplier.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.util.HashSet;
import java.util.Set;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class WarehouseDto implements BaseDto {
    private Long id;
    private Long customerId;
    @Size(min = 1, max = 50, message = "Your identifier should contains at least 1 letter")
    @NotBlank
    private String identifier;
    @Size(min = 1, max = 50, message = "Your type should contains at least 1 letter")
    @NotBlank
    private String type;
    @Size(min = 1, max = 10000, message = "Your totalCapacity shouldn't be empty")
    @NotBlank
    private Double totalCapacity;
    @NotBlank
    private AddressDto addressDto;
    private Set<UserDto> usersDto = new HashSet<>();
}

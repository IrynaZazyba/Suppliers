package by.itech.lab.supplier.dto;

import by.itech.lab.supplier.domain.WarehouseType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Size;
import java.util.ArrayList;
import java.util.List;

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
    private WarehouseType type;
    @Size(min = 1, max = 10000, message = "Your totalCapacity shouldn't be empty")
    @NotBlank
    private Double totalCapacity;
    @NotBlank
    private AddressDto addressDto;
    private Long retailerId;
    @NotEmpty(message = "You must have at least one dispatcher selected")
    private List<Long> dispatchersId = new ArrayList<>();
}

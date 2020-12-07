package by.itech.lab.supplier.dto;

import by.itech.lab.supplier.domain.WarehouseType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.Valid;
import javax.validation.constraints.DecimalMin;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
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
    @NotNull
    private WarehouseType type;
    @DecimalMin(value = "0.0")
    @NotNull
    private Double totalCapacity;
    @NotNull
    @Valid
    private AddressDto addressDto;
    private Long retailerId;
    private List<Long> dispatchersId = new ArrayList<>();
}

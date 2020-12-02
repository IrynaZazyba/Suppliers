package by.itech.lab.supplier.dto;

import by.itech.lab.supplier.domain.WaybillStatus;
import lombok.Builder;
import lombok.Data;

import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
public class WayBillDto implements BaseDto {

    private Long id;
    private String number;
    private LocalDateTime registrationDate;
    private LocalDateTime lastUpdated;
    private WaybillStatus waybillStatus;
    @NotNull(message = "Source location shouldn't be empty")
    private WarehouseDto sourceLocationWarehouseDto;
    private UserDto createdByUsersDto;
    private UserDto updatedByUsersDto;
    @NotNull(message = "Car should be specified")
    private CarDto carDto;
    @NotNull(message = "Car should be specified")
    private UserDto driverDto;
    @NotNull(message = "Applications shouldn't be empty")
    private List<ApplicationDto> applications = new ArrayList<>();

}

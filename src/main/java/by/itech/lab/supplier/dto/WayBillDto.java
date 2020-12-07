package by.itech.lab.supplier.dto;

import by.itech.lab.supplier.domain.WaybillStatus;
import by.itech.lab.supplier.dto.validation.CreateDtoValidationGroup;
import by.itech.lab.supplier.dto.validation.UpdateDtoValidationGroup;
import by.itech.lab.supplier.dto.validation.waybill.constraints.WaybillCreateNumberConstraint;
import by.itech.lab.supplier.dto.validation.waybill.constraints.WaybillUpdateNumberConstraint;
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
    @WaybillCreateNumberConstraint(groups = CreateDtoValidationGroup.class, message = "Already exists number")
    @WaybillUpdateNumberConstraint(groups = UpdateDtoValidationGroup.class, message = "Already exists number")
    private String number;
    private LocalDateTime registrationDate;
    private LocalDateTime lastUpdated;
    private WaybillStatus waybillStatus;
    @NotNull(groups = CreateDtoValidationGroup.class, message = "Source location shouldn't be empty")
    private WarehouseDto sourceLocationWarehouseDto;
    private UserDto createdByUsersDto;
    private UserDto updatedByUsersDto;
    @NotNull(groups = CreateDtoValidationGroup.class, message = "Car must be specified")
    private CarDto carDto;
    @NotNull(groups = CreateDtoValidationGroup.class, message = "Driver must be specified")
    private UserDto driverDto;
    @NotNull(groups = CreateDtoValidationGroup.class, message = "Applications shouldn't be empty")
    private List<ApplicationDto> applications = new ArrayList<>();

}

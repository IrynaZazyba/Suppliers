package by.itech.lab.supplier.dto;

import by.itech.lab.supplier.domain.WaybillStatus;
import by.itech.lab.supplier.dto.validation.CreateDtoValidationGroup;
import by.itech.lab.supplier.dto.validation.UpdateDtoValidationGroup;
import by.itech.lab.supplier.dto.validation.waybill.constraints.WaybillCreateNumberConstraint;
import by.itech.lab.supplier.dto.validation.waybill.constraints.WaybillUpdateNumberConstraint;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Builder;
import lombok.Data;

import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
public class WayBillDto implements BaseDto {

    @JsonIgnore
    private final static String DATE_TIME_PATTERN = "yyyy-MM-dd HH:mm";

    private Long id;
    @WaybillCreateNumberConstraint(groups = CreateDtoValidationGroup.class, message = "Already exists number")
    @WaybillUpdateNumberConstraint(groups = UpdateDtoValidationGroup.class, message = "Already exists number")
    private String number;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = DATE_TIME_PATTERN)
    private LocalDateTime registrationDate;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = DATE_TIME_PATTERN)
    private LocalDateTime lastUpdated;
    private WaybillStatus waybillStatus;
    @NotNull(groups = CreateDtoValidationGroup.class, message = "Source location shouldn't be empty")
    private WarehouseDto sourceLocationWarehouseDto;
    private UserDto createdByUsersDto;
    private UserDto updatedByUsersDto;
    @NotNull(groups = CreateDtoValidationGroup.class, message = "Car must be specified")
    private CarDto car;
    @NotNull(groups = CreateDtoValidationGroup.class, message = "Driver must be specified")
    private UserDto driver;
    @NotNull(groups = CreateDtoValidationGroup.class, message = "Applications shouldn't be empty")
    private List<ApplicationDto> applications = new ArrayList<>();
    @NotNull(groups = CreateDtoValidationGroup.class, message = "Route should be specified")
    private RouteDto route;
    private LocalDateTime deliveryStart;

}

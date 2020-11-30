package by.itech.lab.supplier.dto;

import by.itech.lab.supplier.domain.ApplicationStatus;
import by.itech.lab.supplier.domain.ApplicationType;
import by.itech.lab.supplier.dto.validation.application.constraints.AppNumberConstraint;
import by.itech.lab.supplier.dto.validation.application.constraints.AppNumberUpdateConstraint;
import by.itech.lab.supplier.dto.validation.OnCreate;
import by.itech.lab.supplier.dto.validation.OnUpdate;
import lombok.Builder;
import lombok.Data;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Builder
@Data
public class ApplicationDto implements BaseDto {

    private Long id;
    @AppNumberConstraint(groups = OnCreate.class, message = "Already exists number")
    @AppNumberUpdateConstraint(groups = OnUpdate.class, message = "Already exists number")
    private String number;
    private LocalDate registrationDate;
    private LocalDate lastUpdated;
    @NotNull
    private WarehouseDto sourceLocationDto;
    @NotNull
    private WarehouseDto destinationLocationDto;
    private UserDto createdByUsersDto;
    private UserDto lastUpdatedByUsersDto;
    @NotNull
    private ApplicationStatus applicationStatus;
    private WayBillDto wayBillDto;
    private LocalDate deletedAt;
    private Long customerId;
    private ApplicationType type;
    @NotNull
    @Valid
    private Set<ApplicationItemDto> items = new HashSet<>();
}

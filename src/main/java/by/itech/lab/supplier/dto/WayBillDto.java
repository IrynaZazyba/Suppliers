package by.itech.lab.supplier.dto;

import by.itech.lab.supplier.domain.WaybillStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Data
@Builder
public class WayBillDto implements BaseDto {

    private Long id;
    private String number;
    private LocalDateTime registrationDate;
    private LocalDateTime lastUpdated;
    private WaybillStatus waybillStatus;
    private WarehouseDto sourceLocationWarehouseDto;
    private UserDto createdByUsersDto;
    private UserDto updatedByUsersDto;
    private CarDto carDto;
    private UserDto driverDto;
    private Set<ApplicationDto> applications=new HashSet<>();

}

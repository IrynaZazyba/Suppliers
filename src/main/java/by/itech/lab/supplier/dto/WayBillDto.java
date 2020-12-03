package by.itech.lab.supplier.dto;

import by.itech.lab.supplier.domain.WaybillStatus;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
public class WayBillDto implements BaseDto {

    @JsonIgnore
    private final static String DATE_TIME_PATTERN = "yyyy-MM-dd HH:mm";

    private Long id;
    private String number;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = DATE_TIME_PATTERN)
    private LocalDateTime registrationDate;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = DATE_TIME_PATTERN)
    private LocalDateTime lastUpdated;
    private WaybillStatus waybillStatus;
    private WarehouseDto sourceLocationWarehouseDto;
    private UserDto createdByUsersDto;
    private UserDto updatedByUsersDto;
    private CarDto carDto;
    private UserDto driverDto;
    private List<ApplicationDto> applications = new ArrayList<>();

}

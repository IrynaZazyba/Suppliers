package by.itech.lab.supplier.dto;

import by.itech.lab.supplier.domain.WaybillStatus;
import lombok.Builder;
import lombok.Data;

import java.sql.Date;

@Data
@Builder
public class WayBillDto implements BaseDto {

    private Long id;
    private String number;
    private Date registrationDate;
    private Date lastUpdated;
    private WaybillStatus waybillStatus;
    private AddressDto sourceLocationAddressDto;
    private UserDto createdByUsersDto;
    private UserDto updatedByUsersDto;
    private CarDto carDto;
    private UserDto driverDto;

}

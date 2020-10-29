package by.itech.lab.supplier.dto;

import by.itech.lab.supplier.domain.ApplicationStatus;
import lombok.Builder;
import lombok.Data;

import java.sql.Date;

@Builder
@Data
public class ApplicationDto implements BaseDto {

    private Long id;
    private String number;
    private Date registrationDate;
    private Date lastUpdated;
    private AddressDto sourceLocationAddressIdDto;
    private UserDto createdByUsersDto;
    private UserDto lastUpdatedByUsersDto;
    private ApplicationStatus applicationStatus;
    private WayBillDto wayBillDto;

}

package by.itech.lab.supplier.dto;

import by.itech.lab.supplier.domain.ApplicationStatus;
import lombok.Builder;
import lombok.Data;

import java.sql.Date;
import java.util.Set;

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
    private boolean deleted;
    private Date deletedAt;
    private Set<ItemDto> items;

}

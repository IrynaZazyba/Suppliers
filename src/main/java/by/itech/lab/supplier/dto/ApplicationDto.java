package by.itech.lab.supplier.dto;

import by.itech.lab.supplier.domain.ApplicationStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Builder
@Data
public class ApplicationDto implements BaseDto {

    Set<ItemsInApplicationDto> items = new HashSet<>();
    private Long id;
    private String number;
    private LocalDate registrationDate;
    private LocalDate lastUpdated;
    private AddressDto sourceLocationAddressIdDto;
    private AddressDto destinationLocationAddressIdDto;
    private UserDto createdByUsersDto;
    private UserDto lastUpdatedByUsersDto;
    private ApplicationStatus applicationStatus;
    private WayBillDto wayBillDto;
    private LocalDate deletedAt;

}

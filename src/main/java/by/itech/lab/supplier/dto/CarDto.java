package by.itech.lab.supplier.dto;


import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CarDto implements BaseDto {

    private Long id;
    private String number;
    private Double totalCapacity;
    private Double currentCapacity;
    private CustomerDto customerDto;
    private AddressDto addressDto;

}

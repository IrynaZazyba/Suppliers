package by.itech.lab.supplier.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AddressDto {

    private Long id;
    private String state;
    private String city;
    private String addressLine1;
    private String addressLine2;

}

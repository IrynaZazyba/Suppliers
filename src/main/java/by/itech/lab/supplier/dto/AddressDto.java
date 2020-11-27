package by.itech.lab.supplier.dto;

import lombok.Builder;
import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

@Data
@Builder
public class AddressDto implements BaseDto {

    private Long id;
    @NotBlank
    @Size(min = 1, max = 50)
    private String city;
    @NotBlank
    @Size(min = 1, max = 50)
    private String addressLine1;
    @Size(min = 1, max = 50)
    @NotBlank
    private String addressLine2;
    private StateDto state;
    private Double latitude;
    private Double longitude;

}

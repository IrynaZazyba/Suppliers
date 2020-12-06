package by.itech.lab.supplier.dto;

import lombok.Builder;
import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

@Data
@Builder
public class UsStateDto implements BaseDto {

    private Long id;
    @NotBlank
    @Size(min = 1, max = 50)
    private String state;

}

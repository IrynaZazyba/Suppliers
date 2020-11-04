package by.itech.lab.supplier.auth.dto;

import by.itech.lab.supplier.dto.CustomerDto;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Builder
@Data
public class UserImplDto {

    private Long id;
    private List<CustomerDto> customer;
    private String role;
    private String username;

}

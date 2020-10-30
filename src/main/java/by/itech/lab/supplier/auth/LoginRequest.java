package by.itech.lab.supplier.auth;

import by.itech.lab.supplier.dto.BaseDto;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class LoginRequest implements BaseDto {

    private String username;
    private String password;

}

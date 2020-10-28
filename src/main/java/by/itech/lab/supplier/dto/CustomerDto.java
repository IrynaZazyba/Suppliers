package by.itech.lab.supplier.dto;

import lombok.Builder;
import lombok.Data;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;
import java.time.LocalDate;

@Data
@Builder
public class CustomerDto implements BaseDto {

    private Long id;
    @Size(min = 1, max = 50, message = "Your name should contains at least 2 letters")
    @NotEmpty(message = "Please provide a name")
    @Pattern(regexp = "[*?=%:]", message = "You have typed the wrong characters")
    private String name;
    private LocalDate registrationDate;
    private boolean status;
    private String adminEmail;
}

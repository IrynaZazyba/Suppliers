package by.itech.lab.supplier.service.mail;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@AllArgsConstructor
@Builder
public class Email {
    private String to;
    private String subject;
    private String text;
}

package by.itech.lab.supplier.service.mail;

import by.itech.lab.supplier.domain.User;
import by.itech.lab.supplier.dto.UserDto;
import org.springframework.stereotype.Service;

@Service
public interface MailService {
    void sendMail(UserDto user);

}

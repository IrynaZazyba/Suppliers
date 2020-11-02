package by.itech.lab.supplier.service.mail;

import by.itech.lab.supplier.dto.UserDto;

public interface MailService {
    void sendMail(UserDto userDto);
}

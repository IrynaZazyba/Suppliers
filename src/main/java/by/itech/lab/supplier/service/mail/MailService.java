package by.itech.lab.supplier.service.mail;

import by.itech.lab.supplier.domain.User;

public interface MailService {
    void sendMail(User userDto);

}

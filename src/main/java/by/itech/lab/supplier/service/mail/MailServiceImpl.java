package by.itech.lab.supplier.service.mail;


import by.itech.lab.supplier.domain.User;
import by.itech.lab.supplier.dto.UserDto;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.stringtemplate.v4.ST;
import org.thymeleaf.TemplateEngine;

@Service
@AllArgsConstructor
public class MailServiceImpl implements MailService {
    private static final String LASTNAME = "username";
    private static final String LINK = "link";
    private static final String USERNAME = "adminMail";
    private static final String PASSWORD = "password";
    private static final String ACTIVATION_LINK = "Activation link";

    public void sendMail(UserDto user) {
            Sender sender = new Sender(USERNAME, PASSWORD);
            Email email = new Email();
            email.setTo(user.getEmail());
            email.setSubject(ACTIVATION_LINK);
            email.setText(buildMessage(user, String.format("localhost:8080/users/%s/true", user.getUsername())));
            sender.send(email);
    }

    private String buildMessage(UserDto user, String url) {
        ST st = new ST("Hello, <username>! To activate Your profile, please follow the link below <link>");
        st.add(LASTNAME, user.getUsername());
        st.add(LINK, url);
        return st.render();
    }

}

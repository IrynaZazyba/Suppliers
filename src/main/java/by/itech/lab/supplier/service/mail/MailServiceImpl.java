package by.itech.lab.supplier.service.mail;


import by.itech.lab.supplier.dto.UserDto;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.context.support.PropertySourcesPlaceholderConfigurer;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import org.stringtemplate.v4.ST;


@AllArgsConstructor
@NoArgsConstructor
@Configuration
@PropertySource("classpath:application.properties")
public class MailServiceImpl implements MailService {
    private static final String LASTNAME = "username";
    private static final String LINK = "link";
    private static final String ACTIVATION_LINK = "Activation link";
    @Value("${admin.email}")
    private String email;
    @Value("${admin.password}")
    private String password;

    public void sendMail(UserDto user) {
        Sender sender = new Sender(email, password);
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

    @Bean
    public static PropertySourcesPlaceholderConfigurer propertyConfigInDev() {
        return new PropertySourcesPlaceholderConfigurer();
    }
}

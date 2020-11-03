package by.itech.lab.supplier.service.mail;


import by.itech.lab.supplier.dto.UserDto;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.springframework.context.annotation.PropertySource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.util.HashMap;
import java.util.Map;


@AllArgsConstructor
@Service
@PropertySource("classpath:application.properties")
public class MailServiceImpl implements MailService {
    private static final String ACTIVATION_LINK = "Activation link";
    private static final String HTML_TEMPLATE_NAME = "html/email-simple";
    private final TemplateEngine templateEngine;
    private final Sender sender;

    public void sendMail(final UserDto userDto) {
        Map<String, Object> emailMap = new HashMap<>();
        emailMap.put("firstName", "JavaLab2020");
        emailMap.put("lastName", "Admin");
        emailMap.put("title", "Registration email");
        Context ctx = new Context(LocaleContextHolder.getLocale());
        ctx.setVariables(emailMap);
        final String textContent = templateEngine.process(HTML_TEMPLATE_NAME, ctx);
        Email email = new Email();
        email.setTo(userDto.getEmail());
        email.setSubject(ACTIVATION_LINK);
        email.setText(textContent);
        sender.send(email);
    }
}

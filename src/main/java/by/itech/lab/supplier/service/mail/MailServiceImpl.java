package by.itech.lab.supplier.service.mail;


import by.itech.lab.supplier.dto.UserDto;
import lombok.AllArgsConstructor;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;
import java.util.HashMap;
import java.util.Map;


@AllArgsConstructor
@Service
public class MailServiceImpl implements MailService {
    private static final String HTML_TEMPLATE_NAME = "html/email-simple";
    private final TemplateEngine templateEngine;
    private final Sender sender;

    public void sendMail(final UserDto userDto) {
        Map<String, Object> emailMap = new HashMap<>();
        emailMap.put("firstName", userDto.getName());
        emailMap.put("lastName", userDto.getSurname());
        emailMap.put("activationLink", "localhost:8080/users/" + userDto.getId() + "/1");
        emailMap.put("title", "Registration email");
        Context ctx = new Context(LocaleContextHolder.getLocale());
        ctx.setVariables(emailMap);
        final String textContent = templateEngine.process(HTML_TEMPLATE_NAME, ctx);
        Email email = new Email(userDto.getEmail(), userDto.getEmail(), textContent);
        sender.send(email);
    }
}

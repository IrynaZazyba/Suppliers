package by.itech.lab.supplier;

import by.itech.lab.supplier.domain.Role;
import by.itech.lab.supplier.domain.User;
import by.itech.lab.supplier.repository.UserRepository;
import by.itech.lab.supplier.service.UserService;
import org.apache.commons.lang3.RandomStringUtils;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.auditing.AuditingHandler;
import org.springframework.data.auditing.DateTimeProvider;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.Optional;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;


@RunWith(SpringRunner.class)
@SpringBootTest(classes = SupplierApplication.class)
@Transactional
public class UserServiceTest {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService userService;




    @Mock
    DateTimeProvider dateTimeProvider;

    private User user;

    @Before
    public void init() {
        user = new User();
        user.setUsername("johndoe");
        user.setPassword(RandomStringUtils.random(60));
        user.setActive(true);
        user.setEmail("johndoe@localhost");
        user.setName("john");
        user.setRole(Role.ROLE_ADMIN);
        user.setSurname("doe");
      //  user.setBirthday(new LoDate(34353));

        when(dateTimeProvider.getNow()).thenReturn(Optional.of(LocalDateTime.now()));

    }



    @Test
    @Transactional
    public void testRemoveNotActivatedUsers() {
          when(dateTimeProvider.getNow()).thenReturn(Optional.of(Instant.now().minus(30, ChronoUnit.DAYS)));

        user.setActive(false);
        Optional<User> user=userRepository.findOneByEmailIgnoreCase("johndoe");
//        userRepository.save(user);
//
//        assertThat(userRepository.findOneByUsername("johndoe")).isPresent();
//        userService.deleteUser("johndoe");
//        assertThat(userRepository.findOneByUsername("johndoe")).isNotPresent();

    }

}
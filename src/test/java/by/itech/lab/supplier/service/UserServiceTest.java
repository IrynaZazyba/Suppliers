package by.itech.lab.supplier.service;

import by.itech.lab.supplier.SupplierApplication;
import by.itech.lab.supplier.domain.Address;
import by.itech.lab.supplier.domain.Customer;
import by.itech.lab.supplier.domain.Role;
import by.itech.lab.supplier.domain.User;
import by.itech.lab.supplier.dto.UserDto;
import by.itech.lab.supplier.dto.mapper.CustomerMapper;
import by.itech.lab.supplier.dto.mapper.UserMapper;
import by.itech.lab.supplier.repository.UserRepository;
import by.itech.lab.supplier.service.impl.UserServiceImpl;
import by.itech.lab.supplier.service.mail.MailServiceImpl;
import org.junit.Before;
import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.auditing.DateTimeProvider;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Date;
import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

@SpringBootTest(classes = SupplierApplication.class)
@Transactional
public class UserServiceTest {
    private static final String USERNAME = "johndoe";
    private static final String EMAIL = "johndoe@localhost";
    @Mock
    private UserRepository userRepository;
    @Mock
    private UserMapper userMapper;
    @Mock
    private MailServiceImpl mailService;
    @InjectMocks
    private UserServiceImpl userService;
    private UserDto userDto;
    private User user;

    @Before
    public void init() {
        MockitoAnnotations.initMocks(this);
        userService = new UserServiceImpl(userRepository, userMapper, mailService);
        Address address = new Address();
        address.setAddressLine1("address1");
        address.setAddressLine2("address2");
        Customer customer = new Customer();
        customer.setName("dwwad");
        customer.setActive(true);
        customer.setRegistrationDate(LocalDate.now());
        userDto = new UserDto();
        userDto.setUsername(USERNAME);
        userDto.setPassword("password");
        userDto.setActive(true);
        userDto.setEmail(EMAIL);
        userDto.setName("john");
        userDto.setRole(Role.ROLE_ADMIN);
        userDto.setSurname("doe");
        userDto.setBirthday(LocalDate.of(1999, 11, 15));
        user = new User();
        user.setUsername(USERNAME);
        user.setPassword("password");
        user.setActive(true);
        user.setEmail(EMAIL);
        user.setName("john");
        user.setRole(Role.ROLE_ADMIN);
        user.setSurname("doe");

        user.setBirthday(LocalDate.of(1999, 11, 15));
        user.setCustomer(customer);

    }

    @Test
    public void testGetUserWithAuthoritiesById() {
        when(userRepository.findOneWithRolesById(1L)).thenReturn(Optional.of(user));
        when(userMapper.map(user)).thenReturn(userDto);
        assertEquals(Optional.of(userDto), userService.findById(1L));
    }

    @Test
    public void testCreateUser() {
        when(userMapper.map(userDto)).thenReturn(user);
        when(userRepository.save(user)).thenReturn(user);
        when(userMapper.map(user)).thenReturn(userDto);
        assertEquals(userDto, userService.save(userDto));
    }

    @Test
    public void testUpdateUser() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(userMapper.map(userDto)).thenReturn(user);
        when(userRepository.save(user)).thenReturn(user);
        when(userMapper.map(user)).thenReturn(userDto);
        assertEquals(userDto, userService.save(userDto));
    }

}

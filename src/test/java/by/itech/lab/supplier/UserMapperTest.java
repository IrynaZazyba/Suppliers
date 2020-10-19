package by.itech.lab.supplier;



import by.itech.lab.supplier.domain.User;
import by.itech.lab.supplier.dto.UserDto;
import by.itech.lab.supplier.dto.mapper.UserMapper;
import org.apache.commons.lang3.RandomStringUtils;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.sql.Date;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;


@RunWith(SpringRunner.class)
@SpringBootTest(classes = SupplierApplication.class)
public class UserMapperTest {

    private static final String DEFAULT_LOGIN = "johndoe";

    @Autowired
    private UserMapper userMapper;

    private User user;
    private UserDto userDto;

    private static final Long DEFAULT_ID = 1L;

    @Before
    public void init() {
        user = new User();
        user.setUsername(DEFAULT_LOGIN);
        user.setPassword(RandomStringUtils.random(60));
        user.setActive(true);
        user.setEmail("johndoe@localhost");
        user.setName("john");
        user.setSurname("doe");
        user.setBirthday(new Date(755657575));

        userDto = new UserDto(user);
    }

    @Test
    public void usersToUserDTOsShouldMapOnlyNonNullUsers(){
        List<User> users = new ArrayList<>();
        users.add(user);
        users.add(null);

        List<UserDto> userDTOS = userMapper.usersToUserDTOs(users);

        assertThat(userDTOS).isNotEmpty();
        assertThat(userDTOS).size().isEqualTo(1);
    }

    @Test
    public void userDTOsToUsersShouldMapOnlyNonNullUsers(){
        List<UserDto> usersDto = new ArrayList<>();
        usersDto.add(userDto);
        usersDto.add(null);

        List<User> users = userMapper.userDTOsToUsers(usersDto);

        assertThat(users).isNotEmpty();
        assertThat(users).size().isEqualTo(1);
    }




    @Test
    public void userDTOToUserMapWithNullUserShouldReturnNull(){
        assertThat(userMapper.userDTOToUser(null)).isNull();
    }

    @Test
    public void testUserFromId() {
        assertThat(userMapper.userFromId(DEFAULT_ID).getId()).isEqualTo(DEFAULT_ID);
        assertThat(userMapper.userFromId(null)).isNull();
    }
}

package by.itech.lab.supplier.dto.mapper;

import by.itech.lab.supplier.domain.User;
import by.itech.lab.supplier.dto.UserDto;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class UserMapper {

    public List<UserDto> usersToUserDTOs(List<User> users) {
        return users.stream()
                .filter(Objects::nonNull)
                .map(this::userToUserDTO)
                .collect(Collectors.toList());
    }

    public UserDto userToUserDTO(User user) {
        return new UserDto(user);
    }

    public List<User> userDTOsToUsers(List<UserDto> userDTOs) {
        return userDTOs.stream()
                .filter(Objects::nonNull)
                .map(this::userDTOToUser)
                .collect(Collectors.toList());
    }

    public User userDTOToUser(UserDto userDTO) {
        if (userDTO == null) {
            return null;
        } else {
            User user = new User();
            user.setId(userDTO.getId());
            user.setUsername(userDTO.getUsername());
            user.setName(userDTO.getName());
            user.setSurname(userDTO.getSurname());
            user.setEmail(userDTO.getEmail());
            user.setBirthday(userDTO.getBirthday());
            user.setActive(userDTO.isActive());
            user.setRole(userDTO.getRole());
            user.setCreatorApplications(userDTO.getCreatorApplications());
            user.setUpdatorApplications(userDTO.getUpdatorApplications());
            user.setCreatorWayBills(userDTO.getCreatorWayBills());
            user.setDriverWayBills(userDTO.getDriverWayBills());
            user.setAddress(userDTO.getAddress());
            user.setCustomer(userDTO.getCustomer());

            return user;
        }
    }



    public User userFromId(Long id) {
        if (Objects.isNull(id)) {
            return null;
        }
        User user = new User();
        user.setId(id);
        return user;
    }
}
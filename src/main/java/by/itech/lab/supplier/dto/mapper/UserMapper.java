package by.itech.lab.supplier.dto.mapper;

import by.itech.lab.supplier.domain.Category;
import by.itech.lab.supplier.domain.User;
import by.itech.lab.supplier.dto.CategoryDto;
import by.itech.lab.supplier.dto.UserDto;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Component
public class UserMapper implements BaseMapper<User, UserDto> {

    public List<UserDto> usersToUserDTOs(List<User> users) {
        return users.stream()
                .filter(Objects::nonNull)
                .map(this::map)
                .collect(Collectors.toList());
    }

    @Override
    public UserDto map(User user) {
        return UserDto.builder()
                .id(user.getId())
                .username(user.getUsername())
                .name(user.getName())
                .surname(user.getSurname())
                .email(user.getEmail())
                .birthday(user.getBirthday())
                .active(user.isActive())
                .role(user.getRole())
                .creatorApplications(user.getCreatorApplications())
                .updatorApplications(user.getUpdatorApplications())
                .creatorWayBills(user.getCreatorWayBills())
                .driverWayBills(user.getDriverWayBills())
                .address(user.getAddress())
                .customer(user.getCustomer())
                .build();
    }

    public List<User> userDTOsToUsers(List<UserDto> userDTOs) {
        return userDTOs.stream()
                .filter(Objects::nonNull)
                .map(this::map)
                .collect(Collectors.toList());
    }

    public User mapUserWithId(final UserDto userDTO) {
        User user = fillCategory(userDTO);
        user.setId(user.getId());
        return user;
    }

    private User fillCategory(final UserDto userDTO) {
        User user = User.builder()
                .username(userDTO.getUsername())
                .name(userDTO.getName())
                .surname(userDTO.getSurname())
                .email(userDTO.getEmail())
                .birthday(userDTO.getBirthday())
                .active(userDTO.isActive())
                .role(userDTO.getRole())
                .creatorApplications(userDTO.getCreatorApplications())
                .updatorApplications(userDTO.getUpdatorApplications())
                .creatorWayBills(userDTO.getCreatorWayBills())
                .driverWayBills(userDTO.getDriverWayBills())
                .address(userDTO.getAddress())
                .customer(userDTO.getCustomer())
                .build();
        return user;
    }

    @Override
    public User map(UserDto userDTO) {
        return fillCategory(userDTO);
    }
}
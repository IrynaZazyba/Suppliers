package by.itech.lab.supplier.dto.mapper;

import by.itech.lab.supplier.domain.User;
import by.itech.lab.supplier.dto.UserDto;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

@AllArgsConstructor
@Component
public class UserMapper implements BaseMapper<User, UserDto> {

    private final CustomerMapper customerMapper;

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
                .deletedAt(user.getDeletedAt())
                .address(user.getAddress())
                .customerDto(customerMapper.map(user.getCustomer()))
                .build();
    }

    public void update(final UserDto from, final User to) {
        to.setName(from.getName());
        to.setSurname(from.getSurname());
        to.setBirthday(from.getBirthday());
        to.setActive(from.isActive());
        to.setDeletedAt(from.getDeletedAt());
        to.setRole(from.getRole());
        to.setAddress(from.getAddress());
        to.setCustomer(customerMapper.map(from.getCustomerDto()));
    }

    @Override
    public User map(UserDto userDTO) {
        return User.builder()
                .id(userDTO.getId())
                .username(userDTO.getUsername())
                .name(userDTO.getName())
                .surname(userDTO.getSurname())
                .email(userDTO.getEmail())
                .birthday(userDTO.getBirthday())
                .active(userDTO.isActive())
                .deletedAt(userDTO.getDeletedAt())
                .role(userDTO.getRole())
                .address(userDTO.getAddress())
                .customer(customerMapper.map(userDTO.getCustomerDto()))
                .build();
    }
}

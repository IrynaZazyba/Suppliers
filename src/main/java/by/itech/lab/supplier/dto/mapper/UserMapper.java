package by.itech.lab.supplier.dto.mapper;

import by.itech.lab.supplier.domain.User;
import by.itech.lab.supplier.dto.UserDto;
import org.springframework.stereotype.Component;

@Component
public class UserMapper implements BaseMapper<User, UserDto> {

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
                .deleted(user.isDeleted())
                .creatorApplications(user.getCreatorApplications())
                .updatorApplications(user.getUpdatorApplications())
                .creatorWayBills(user.getCreatorWayBills())
                .driverWayBills(user.getDriverWayBills())
                .address(user.getAddress())
                .customer(user.getCustomer())
                .build();
    }

    public void update(final UserDto from, final User to) {
        to.setName(from.getName());
        to.setSurname(from.getSurname());
        to.setBirthday(from.getBirthday());
        to.setActive(from.isActive());
        to.setDeleted(from.isDeleted());
        to.setRole(from.getRole());
        to.setCreatorApplications(from.getCreatorApplications());
        to.setUpdatorApplications(from.getUpdatorApplications());
        to.setCreatorWayBills(from.getCreatorWayBills());
        to.setDriverWayBills(from.getDriverWayBills());
        to.setAddress(from.getAddress());
        to.setCustomer(from.getCustomer());
    }

    @Override
    public User map(UserDto userDTO) {
        return User.builder()
                .username(userDTO.getUsername())
                .name(userDTO.getName())
                .surname(userDTO.getSurname())
                .email(userDTO.getEmail())
                .birthday(userDTO.getBirthday())
                .active(userDTO.isActive())
                .deleted(userDTO.isDeleted())
                .role(userDTO.getRole())
                .creatorApplications(userDTO.getCreatorApplications())
                .updatorApplications(userDTO.getUpdatorApplications())
                .creatorWayBills(userDTO.getCreatorWayBills())
                .driverWayBills(userDTO.getDriverWayBills())
                .address(userDTO.getAddress())
                .customer(userDTO.getCustomer())
                .build();
    }

}

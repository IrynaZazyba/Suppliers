package by.itech.lab.supplier.dto.mapper;

import by.itech.lab.supplier.domain.User;
import by.itech.lab.supplier.dto.UserDto;
import lombok.AllArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Objects;

@AllArgsConstructor
@Component
public class UserMapper implements BaseMapper<User, UserDto> {

    private final AddressMapper addressMapper;
    private final WarehouseMapper warehouseMapper;
    private final PasswordEncoder passwordEncoder;

    private CustomerMapper customerMapper;

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
                .password(user.getPassword())
                .role(user.getRole())
                .customerDto(user.getCustomer() != null ? customerMapper.map(user.getCustomer()) : null)
                .deletedAt(user.getDeletedAt())
                .addressDto(user.getAddress() != null ? addressMapper.map(user.getAddress()) : null)
                .warehouseDto(Objects.isNull(user.getWarehouse()) ? null : warehouseMapper.map(user.getWarehouse()))
                .customerDto(user.getCustomer() != null ? customerMapper.map(user.getCustomer()) : null)
                .build();
    }

    public void update(final UserDto from, final User to) {
        to.setName(from.getName());
        to.setSurname(from.getSurname());
        to.setBirthday(from.getBirthday());
        to.setActive(from.isActive());
        to.setDeletedAt(from.getDeletedAt());
        to.setRole(from.getRole());
        to.setAddress(from.getAddressDto() != null ? addressMapper.map(from.getAddressDto()) : null);
    }

    @Override
    public User map(UserDto userDTO) {
        return User.builder()
                .id(userDTO.getId())
                .username(userDTO.getUsername())
                .name(userDTO.getName())
                .surname(userDTO.getSurname())
                .email(userDTO.getEmail())
                .password((userDTO.getId() != null || userDTO.getPassword() == null) ? userDTO.getPassword() : passwordEncoder.encode(userDTO.getPassword()))
                .birthday(userDTO.getBirthday())
                .active(userDTO.isActive())
                .deletedAt(userDTO.getDeletedAt())
                .role(userDTO.getRole())
                .customer(userDTO.getCustomerDto() != null ? customerMapper.map(userDTO.getCustomerDto()) : null)
                .address(userDTO.getAddressDto() != null ? addressMapper.map(userDTO.getAddressDto()) : null)
                .warehouse(Objects.isNull(userDTO.getWarehouseDto())
                        ? null :
                        warehouseMapper.map(userDTO.getWarehouseDto()))
                .customer(userDTO.getCustomerDto() != null ? customerMapper.map(userDTO.getCustomerDto()) : null)
                .build();
    }

}

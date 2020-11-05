package by.itech.lab.supplier.service.impl;

import by.itech.lab.supplier.domain.Role;
import by.itech.lab.supplier.domain.User;
import by.itech.lab.supplier.dto.CustomerDto;
import by.itech.lab.supplier.dto.UserDto;
import by.itech.lab.supplier.dto.mapper.CustomerMapper;
import by.itech.lab.supplier.dto.mapper.UserMapper;
import by.itech.lab.supplier.repository.UserRepository;
import by.itech.lab.supplier.service.UserService;
import by.itech.lab.supplier.service.mail.MailService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Objects;
import java.util.Optional;

@Service
@Transactional
@Slf4j
@AllArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    private final UserMapper userMapper;

    private final MailService mailService;

    @Override
    public Optional<UserDto> findById(Long id) {
        return userRepository.findOneWithRolesById(id).map(userMapper::map);
    }

    @Override
    public Page<UserDto> findAll(Pageable pageable) {
        return userRepository.findAll(pageable).map(userMapper::map);
    }

    @Override
    public Page<UserDto> getAllActive(Pageable pageable) {
        return userRepository.findAllByActiveEquals(pageable, true).map(userMapper::map);
    }

    public UserDto save(UserDto userDTO) {
        User user = Optional.ofNullable(userDTO.getId())
                .map(item -> {
                    final User existing = userRepository
                            .findById(userDTO.getId())
                            .orElseThrow();
                    userMapper.update(userDTO, existing);
                    return existing;
                })
                .orElseGet(() -> userMapper.map(userDTO));

        final User saved = userRepository.save(user);
        if (Objects.isNull(user.getId())) {
            mailService.sendMail(userDTO);
        }
        return userMapper.map(saved);
    }

    @Override
    @Transactional
    public boolean changeActiveStatus(Long id, boolean status) {
        return userRepository.setStatus(status, id);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        userRepository.delete(id);
    }

    @Override
    public UserDto createAdmin(CustomerDto customerDto) {
        return UserDto.builder()
                .name("Name")
                .surname("Surname")
                .username("User name")
                .email(customerDto.getAdminEmail())
                .role(Role.ROLE_ADMIN)
                .customerDto(customerDto)
                .active(false)
                .build();
    }
}

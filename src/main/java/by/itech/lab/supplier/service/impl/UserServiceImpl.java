package by.itech.lab.supplier.service.impl;

import by.itech.lab.supplier.domain.Role;
import by.itech.lab.supplier.domain.User;
import by.itech.lab.supplier.dto.CustomerDto;
import by.itech.lab.supplier.dto.UserDto;
import by.itech.lab.supplier.dto.mapper.UserMapper;
import by.itech.lab.supplier.exception.ResourceNotFoundException;
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
    public Page<UserDto> findAllByActive( Pageable pageable,  boolean status) {
        return userRepository.findByStatus(pageable, status).map(userMapper::map);
    }
    private final MailService mailService;

    @Override
    public Optional<UserDto> findById(Long id) {
        return Optional.of(userRepository.findOneWithRolesById(id).map(userMapper::map)
                .orElseThrow(() -> new ResourceNotFoundException("User with id=" + id + " doesn't exist")));
    }

    @Override
    public Page<UserDto> findAll(Pageable pageable) {
        return userRepository.findAll(pageable).map(userMapper::map);
    }

    @Override
    public Page<UserDto> getAllActive(Pageable pageable) {
        return userRepository.findAllByActiveEquals(pageable, true).map(userMapper::map);
    }

    @Transactional
    public UserDto save(UserDto userDTO) {
        User user = Optional.ofNullable(userDTO.getId())
                .map(item -> {
                    final User existing = userRepository
                            .findById(userDTO.getId())
                            .orElseThrow(() -> new ResourceNotFoundException("User with id=" + userDTO.getId() + " doesn't exist"));
                    userMapper.update(userDTO, existing);
                    return existing;
                })
                .orElseGet(() -> userMapper.map(userDTO));
        if (Objects.isNull(user.getId())) {
            mailService.sendMail(userDTO);
        }
        final User saved = userRepository.save(user);
        return userMapper.map(saved);
    }

    @Override
    @Transactional
    public int changeActiveStatus(Long id, boolean status) {
        return userRepository.setStatus(status, id);
    }

    @Override
    @Transactional
    public int changePassword(Long id, String password) {
        return userRepository.changePassword(password, id);
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

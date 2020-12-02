package by.itech.lab.supplier.service.impl;

import by.itech.lab.supplier.auth.domain.UserImpl;
import by.itech.lab.supplier.domain.Role;
import by.itech.lab.supplier.domain.User;
import by.itech.lab.supplier.domain.Warehouse;
import by.itech.lab.supplier.dto.CustomerDto;
import by.itech.lab.supplier.dto.UserDto;
import by.itech.lab.supplier.dto.mapper.UserMapper;
import by.itech.lab.supplier.exception.ResourceNotFoundException;
import by.itech.lab.supplier.repository.UserRepository;
import by.itech.lab.supplier.service.UserService;
import by.itech.lab.supplier.service.mail.MailService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.RandomStringUtils;
import org.apache.commons.lang3.RandomUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
@Transactional
@Slf4j
@AllArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    private final MailService mailService;

    @Override
    public Page<UserDto> findAllByActive( Pageable pageable,  Boolean status) {
        return userRepository.findByStatus(pageable, status).map(userMapper::map);
    }


    @Override
    public UserDto findById(Long id) {
        return userRepository.findOneWithRolesById(id).map(userMapper::map)
                .orElseThrow(() -> new ResourceNotFoundException("User with id=" + id + " doesn't exist"));
    }

    @Override
    public UserDto findByUsername(String username) {
        return userRepository.findByEmail(username).map(userMapper::map)
                .orElseThrow(() -> new ResourceNotFoundException("User with username=" + username + " doesn't exist"));
    }

    @Override
    public Page<UserDto> findAll(Pageable pageable) {
        return userRepository.findAll(pageable).map(userMapper::map);
    }

    @Override
    public Page<UserDto> getAllActive(Pageable pageable, Boolean status) {
        return userRepository.findAllByActiveEquals(pageable, status).map(userMapper::map);
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
                .orElseGet(() -> {
                    userDTO.setPassword(RandomStringUtils.random(10, 97, 122, true, true));
                    return userMapper.map(userDTO);});
        if (Objects.isNull(user.getId())) {
            mailService.sendMail(userDTO);
        }
        final User saved = userRepository.save(user);
        return userMapper.map(saved);
    }

    @Override
    @Transactional
    public int changeActiveStatus(Long id, Boolean status) {
        return userRepository.setStatus(status, id);
    }

    @Override
    @Transactional
    public int changeActive(Long id) {
        return userRepository.setStatus(true, id);
    }


    @Override
    @Transactional
    public int changePassword(Long id, String password) {
        UserImpl principal = (UserImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if(principal.getId().equals(id))
        return userRepository.changePassword(passwordEncoder.encode(password), principal.getId());
        return 0;
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
                .email(customerDto.getAdminEmail())
                .role(Role.ROLE_ADMIN)
                .customerDto(customerDto)
                .active(false)
                .build();
    }

    @Override
    public Page<UserDto> getAllDispatchers(Long customerId, Pageable pageable) {
        return userRepository.getAllDispatchers(customerId, pageable, Role.ROLE_DISPATCHER).map(userMapper::map);
    }

    @Override
    public void setWarehouseIntoUser(Warehouse warehouse, List<Long> usersId) {
        userRepository.setWarehouseIntoUser(warehouse, usersId);
    }
}

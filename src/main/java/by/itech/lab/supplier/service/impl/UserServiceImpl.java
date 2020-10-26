package by.itech.lab.supplier.service.impl;

import by.itech.lab.supplier.domain.Category;
import by.itech.lab.supplier.domain.User;
import by.itech.lab.supplier.dto.CategoryDto;
import by.itech.lab.supplier.dto.UserDto;
import by.itech.lab.supplier.dto.mapper.UserMapper;
import by.itech.lab.supplier.repository.UserRepository;
import by.itech.lab.supplier.service.UserService;
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

    @Override
    public Optional<UserDto> getUserWithAuthoritiesById(Long id) {
        return userRepository.findOneWithRolesById(id).map(userMapper::map);
    }

    public Page<UserDto> getAll(Pageable pageable) {
        return userRepository.findAll(pageable).map(userMapper::map);
    }

    public Page<UserDto> getAllActive(Pageable pageable) {
        return userRepository.findAllByActiveEquals(pageable, true).map(userMapper::map);
    }

    @Override
    public UserDto saveUser(UserDto userDTO) {
        User user;
        if (Objects.isNull(userDTO.getId())) {
            user = userMapper.map(userDTO);
        } else {
            user = userMapper.mapUserWithId(userDTO);
        }
        return userMapper.map(userRepository.save(user));
    }

    @Override
    @Transactional
    public boolean changeActiveStatus(Long id, boolean status) {
        return userRepository.setStatus(status, id);
    }

    @Override
    @Transactional
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

}
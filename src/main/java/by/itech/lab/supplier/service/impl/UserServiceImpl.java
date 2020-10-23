package by.itech.lab.supplier.service.impl;

import by.itech.lab.supplier.domain.Role;
import by.itech.lab.supplier.domain.User;
import by.itech.lab.supplier.dto.CategoryDto;
import by.itech.lab.supplier.dto.UserDto;
import by.itech.lab.supplier.dto.mapper.CategoryMapper;
import by.itech.lab.supplier.dto.mapper.UserMapper;
import by.itech.lab.supplier.repository.UserRepository;
import by.itech.lab.supplier.service.UserService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
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

    @Override
    public UserDto createUser(UserDto userDTO) {
        User user = userRepository.save(userMapper.map(userDTO));
        return userMapper.map(user);
    }

    @Override
    public Optional<UserDto> updateUser(UserDto userDTO) {
        return Optional.of(userRepository.findById(userDTO.getId()))
                .filter(Optional::isPresent)
                .map(Optional::get)
                .map(user -> {
                    userRepository.save( userMapper.map(userDTO));
                    return user;
                })
                .map(userMapper::map);
    }

    @Override
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    public boolean removeNonActivatedUser(User existingUser) {
        if (existingUser.isActive()) {
            return false;
        }
        userRepository.delete(existingUser);
        userRepository.flush();
        return true;
    }


}
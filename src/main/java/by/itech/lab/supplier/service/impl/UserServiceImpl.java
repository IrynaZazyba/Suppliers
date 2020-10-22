package by.itech.lab.supplier.service.impl;

import by.itech.lab.supplier.domain.Role;
import by.itech.lab.supplier.domain.User;
import by.itech.lab.supplier.dto.UserDto;
import by.itech.lab.supplier.repository.UserRepository;

import by.itech.lab.supplier.service.UserService;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.apache.commons.lang3.RandomStringUtils;

import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;

@Service
@Transactional
public class UserServiceImpl implements UserService {
    private final Logger log = LoggerFactory.getLogger(UserServiceImpl.class);
    private final UserRepository userRepository;

    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<UserDto> getUserWithAuthoritiesById(Long id) {
        return userRepository.findOneWithRolesById(id).map(UserDto::new);
    }

    @Transactional(readOnly = true)
    public Page<UserDto> getAllManagedUsers(Pageable pageable) {
        return userRepository.findAllByUsernameNot(pageable, Role.UNREGISTERED.getRole()).map(UserDto::new);
    }

    @Override
    public UserDto createUser(UserDto userDTO) {
        if (userRepository.existsByUsername(userDTO.getUsername())) {
            throw new RuntimeException("user with this username:" + userDTO.getUsername() + " already exist");
        }
        if (userRepository.existsByEmail(userDTO.getEmail())) {
            throw new RuntimeException("user with this email:" + userDTO.getEmail() + " already exist");
        }
        User user = new User();
        user.setUsername(userDTO.getUsername().toLowerCase());
        user.setName(userDTO.getName());
        user.setSurname(userDTO.getSurname());
        user.setEmail(userDTO.getEmail().toLowerCase());
        user.setBirthday(userDTO.getBirthday());
        String encryptedPassword = "dfdd";//passwordEncoder.encode( RandomStringUtils.randomAlphanumeric(20));
        user.setPassword(encryptedPassword);
        user.setActive(true);
        user.setRole(userDTO.getRole());
        userRepository.save(user);
        log.debug("Created Information for User: {}", user);
        return new UserDto(user);
    }

    @Override
    public Optional<UserDto> updateUser(UserDto userDTO) {
        if (!userRepository.existsById(userDTO.getId())) {
            throw new RuntimeException("user is not exist");
        }
        if (userRepository.existsByUsernameIsAndIdNot(userDTO.getUsername(), userDTO.getId())) {
            throw new RuntimeException("user with this username:" + userDTO.getUsername() + " already exist");
        }
        if (userRepository.existsByEmailIsAndIdNot(userDTO.getEmail(), userDTO.getId())) {
            throw new RuntimeException("user with this email:" + userDTO.getEmail() + " already exist");
        }
        return Optional.of(userRepository.findById(userDTO.getId()))
                .filter(Optional::isPresent)
                .map(Optional::get)
                .map(user -> {
                    user.setUsername(userDTO.getUsername().toLowerCase());
                    user.setName(userDTO.getName());
                    user.setSurname(userDTO.getSurname());
                    user.setEmail(userDTO.getEmail().toLowerCase());
                    user.setBirthday(userDTO.getBirthday());
                    user.setActive(userDTO.isActive());
                    Role managedAuthorities = userDTO.getRole();
                    user.setRole(managedAuthorities);
                    userRepository.save(user);
                    log.debug("Changed Information for User: {}", user);
                    return user;
                })
                .map(UserDto::new);
    }

    @Override
    public boolean updateUserActivationState(List<UserDto> userDTOs) {
        boolean isSuccess = false;
        for (UserDto userDTO:
            userDTOs ) {
            isSuccess = false;
            if (!userRepository.existsById(userDTO.getId())) {
                throw new RuntimeException("user does not exist");
            }
            if (userRepository.existsByUsernameIsAndIdNot(userDTO.getUsername(), userDTO.getId())) {
                throw new RuntimeException("user with this username:" + userDTO.getUsername() + " already exists");
            }
            if (userRepository.existsByEmailIsAndIdNot(userDTO.getEmail(), userDTO.getId())) {
                throw new RuntimeException("user with this email:" + userDTO.getEmail() + " already exists");
            }
            isSuccess = userRepository.setStatus(userDTO.isActive(), userDTO.getId());

        }
        return isSuccess;
    }

    @Override
    public void deleteUser(Long id) {
        userRepository.findOneById(id).ifPresent(user -> {
            userRepository.delete(user);
            log.debug("Deleted User: {}", user);
        });
    }

    @Override
    public Optional<UserDto> activateRegistration(String key) {
        log.debug("Activating user for activation key {}", key);
        return userRepository.findOneByActivationKey(key)
                .map(user -> {
                    user.setActive(true);
                    user.setActivationKey(null);
                    userRepository.save(user);

                    log.debug("Activated user: {}", user);
                    return user;
                }).map(UserDto::new);
    }

    @Override
    public UserDto registerUser(UserDto userDTO, String password) {
        userRepository.findOneById(userDTO.getId()).ifPresent(existingUser -> {
            boolean removed = removeNonActivatedUser(existingUser);
            if (!removed) {

            }
        });
        userRepository.findOneByEmailIgnoreCase(userDTO.getEmail()).ifPresent(existingUser -> {
            boolean removed = removeNonActivatedUser(existingUser);
            if (!removed) {

            }
        });
        User newUser = new User();
        String encryptedPassword = password; //passwordEncoder.encode(password);
        newUser.setUsername(userDTO.getUsername().toLowerCase());
        // new user gets initially a generated password
        newUser.setPassword(encryptedPassword);
        newUser.setName(userDTO.getName());
        newUser.setSurname(userDTO.getSurname());
        newUser.setEmail(userDTO.getEmail().toLowerCase());
        newUser.setBirthday(userDTO.getBirthday());
        // new user is not active
        newUser.setActive(false);
        // new user gets registration key
        newUser.setActivationKey(RandomStringUtils.randomAlphanumeric(20));

        newUser.setRole(userDTO.getRole());
        userRepository.save(newUser);

        log.debug("Created Information for User: {}", newUser);
        return new UserDto(newUser);
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
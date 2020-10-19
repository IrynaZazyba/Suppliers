package by.itech.lab.supplier.service.impl;

import by.itech.lab.supplier.domain.Role;
import by.itech.lab.supplier.domain.User;
import by.itech.lab.supplier.dto.UserDto;
import by.itech.lab.supplier.repository.UserRepository;
import by.itech.lab.supplier.repository.UserSearchRepository;
import by.itech.lab.supplier.service.UserService;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.apache.commons.lang3.RandomStringUtils;

import java.time.Instant;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import org.slf4j.Logger;

import java.util.stream.Collectors;

@Service
@Transactional
public class UserServiceImpl implements UserService {

    private final Logger log = LoggerFactory.getLogger(UserServiceImpl.class);

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    private final UserSearchRepository userSearchRepository;



    public UserServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder, UserSearchRepository userSearchRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.userSearchRepository = userSearchRepository;

    }

    @Override
    public Optional<User> activateRegistration(String key) {
        log.debug("Activating user for activation key {}", key);
        return userRepository.findOneByActivationKey(key)
                .map(user -> {
                    user.setActivated(true);
                    user.setActivationKey(null);
                    userSearchRepository.save(user);

                    log.debug("Activated user: {}", user);
                    return user;
                });
    }




    @Override
    public User registerUser(UserDto userDTO, String password) {
        userRepository.findOneByLogin(userDTO.getLogin().toLowerCase()).ifPresent(existingUser -> {
            boolean removed = removeNonActivatedUser(existingUser);
            if (!removed) {
                throw new LoginAlreadyUsedException();
            }
        });
        userRepository.findOneByEmailIgnoreCase(userDTO.getEmail()).ifPresent(existingUser -> {
            boolean removed = removeNonActivatedUser(existingUser);
            if (!removed) {
                throw new EmailAlreadyUsedException();
            }
        });
        User newUser = new User();
        String encryptedPassword = passwordEncoder.encode(password);
        newUser.setLogin(userDTO.getLogin().toLowerCase());
        // new user gets initially a generated password
        newUser.setPassword(encryptedPassword);
        newUser.setName(userDTO.getFirstName());
        newUser.setEmail(userDTO.getEmail().toLowerCase());

        // new user is not active
        newUser.setActivated(false);
        // new user gets registration key
        newUser.setActivationKey( RandomStringUtils.randomAlphanumeric(20));

        newUser.setRole(userDTO.getRole());
        userRepository.save(newUser);
        userSearchRepository.save(newUser);

        log.debug("Created Information for User: {}", newUser);
        return newUser;
    }

    @Override
    public User createUser(UserDto userDTO) {
        User user = new User();
        user.setLogin(userDTO.getLogin().toLowerCase());
        user.setName(userDTO.getFirstName());
        user.setEmail(userDTO.getEmail().toLowerCase());

        String encryptedPassword = passwordEncoder.encode( RandomStringUtils.randomAlphanumeric(20));
        user.setPassword(encryptedPassword);
        user.setActivated(true);
        user.setRole(userDTO.getRole());
        userRepository.save(user);
        userSearchRepository.save(user);

        log.debug("Created Information for User: {}", user);
        return user;
    }




    @Override
    public Optional<UserDto> updateUser(UserDto userDTO) {
        return Optional.of(userRepository
                .findById(userDTO.getId()))
                .filter(Optional::isPresent)
                .map(Optional::get)
                .map(user -> {

                    user.setLogin(userDTO.getLogin().toLowerCase());
                    user.setName(userDTO.getFirstName());
                    user.setEmail(userDTO.getEmail().toLowerCase());
                    user.setActivated(userDTO.isActivated());
                      Role managedAuthorities = userDTO.getRole();
                   user.setRole(managedAuthorities);
                    userSearchRepository.save(user);
                    log.debug("Changed Information for User: {}", user);
                    return user;
                })
                .map(UserDto::new);
    }

    public boolean removeNonActivatedUser(User existingUser) {
        if (existingUser.getActivated()) {
            return false;
        }
        userRepository.delete(existingUser);
        userRepository.flush();

        return true;
    }

    @Override
    public void deleteUser(String login) {
        userRepository.findOneByLogin(login).ifPresent(user -> {
            userRepository.delete(user);
            userSearchRepository.delete(user);

            log.debug("Deleted User: {}", user);
        });
    }

    @Override
    public void changePassword(String currentClearTextPassword, String newPassword) {
        SecurityUtils.getCurrentUserLogin()
                .flatMap(userRepository::findOneByLogin)
                .ifPresent(user -> {
                    String currentEncryptedPassword = user.getPassword();
                    if (!passwordEncoder.matches(currentClearTextPassword, currentEncryptedPassword)) {
                        throw new InvalidPasswordException();
                    }
                    String encryptedPassword = passwordEncoder.encode(newPassword);
                    user.setPassword(encryptedPassword);

                });
        log.debug("Changed password");
    }

    @Override
    @Transactional(readOnly = true)
    public Page<UserDto> getAllManagedUsers(Pageable pageable) {
        return userRepository.findAllByLoginNot(pageable, Role.UNREGISTERED.getRole()).map(UserDto::new);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<User> getUserWithAuthoritiesByLogin(String login) {
        return userRepository.findOneWithRolesByLogin(login);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<User> getUserWithAuthorities(Long id) {
        return userRepository.findOneWithRolesById(id);
    }





}
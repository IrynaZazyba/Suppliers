package by.itech.lab.supplier.service;

import by.itech.lab.supplier.domain.User;
import by.itech.lab.supplier.dto.UserDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public interface UserService {
    Optional<User> activateRegistration(String key);

    User registerUser(UserDto userDTO, String password);



    User createUser(UserDto userDTO);

    void updateUser(String name, String email, String langKey, String imageUrl);

    Optional<UserDto> updateUser(UserDto userDTO);

    void deleteUser(String login);

    void changePassword(String currentClearTextPassword, String newPassword);

    @Transactional(readOnly = true)
    Page<UserDto> getAllManagedUsers(Pageable pageable);

    @Transactional(readOnly = true)
    Optional<User> getUserWithAuthoritiesByLogin(String login);

    @Transactional(readOnly = true)
    Optional<User> getUserWithAuthorities(Long id);

    @Transactional(readOnly = true)
    Optional<User> getUserWithAuthorities();


}

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

    Optional<UserDto> updateUser(UserDto userDTO);

    void deleteUser(String login);

    Page<UserDto> getAllManagedUsers(Pageable pageable);

//    void changePassword(String currentClearTextPassword, String newPassword);

//    @Transactional(readOnly = true)
//    Page<UserDto> getAllManagedUsers(Pageable pageable);

    @Transactional(readOnly = true)
    Optional<User> getUserWithAuthoritiesByUsername(String login);



//    @Transactional(readOnly = true)
//    Optional<User> getUserWithAuthorities();


}

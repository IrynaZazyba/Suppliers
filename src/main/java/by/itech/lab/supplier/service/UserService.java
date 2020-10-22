package by.itech.lab.supplier.service;

import by.itech.lab.supplier.dto.UserDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public interface UserService {
    @Transactional(readOnly = true)
    Optional<UserDto> getUserWithAuthoritiesById(Long id);

    Page<UserDto> getAllManagedUsers(Pageable pageable);

    UserDto createUser(UserDto userDTO);

    Optional<UserDto> updateUser(UserDto userDTO);

    void deleteUser(Long id);

    Optional<UserDto> activateRegistration(String key);

    UserDto registerUser(UserDto userDTO, String password);

//    void changePassword(String currentClearTextPassword, String newPassword);
//    @Transactional(readOnly = true)

//    Page<UserDto> getAllManagedUsers(Pageable pageable);



//    @Transactional(readOnly = true)
//    Optional<User> getUserWithAuthorities();


}

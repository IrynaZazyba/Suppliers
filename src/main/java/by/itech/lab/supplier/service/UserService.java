package by.itech.lab.supplier.service;

import by.itech.lab.supplier.dto.UserDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public interface UserService {

    Optional<UserDto> getUserWithAuthoritiesById(Long id);

    Page<UserDto> getAll(Pageable pageable);

    UserDto saveUser(UserDto userDTO);

    void deleteUser(Long id);

    boolean changeActiveStatus(Long id, boolean status);

}

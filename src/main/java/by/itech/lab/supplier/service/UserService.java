package by.itech.lab.supplier.service;

import by.itech.lab.supplier.dto.UserDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public interface UserService {

    Optional<UserDto> findById(Long id);

    Page<UserDto> findAll(Pageable pageable);

    UserDto save(UserDto userDTO);

    void delete(Long id);

    boolean changeActiveStatus(String username, boolean status);

    Page<UserDto> getAllActive(Pageable pageable);

}

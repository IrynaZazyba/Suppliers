package by.itech.lab.supplier.service;

import by.itech.lab.supplier.domain.Warehouse;
import by.itech.lab.supplier.dto.CustomerDto;
import by.itech.lab.supplier.dto.UserDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public interface UserService {

    UserDto createAdmin(CustomerDto customerDto);

    Optional<UserDto> findById(Long id);

    Page<UserDto> findAll(Pageable pageable);

    UserDto save(UserDto userDTO);

    void delete(Long id);

    int changeActiveStatus(Long id, boolean status);

    Page<UserDto> getAllActive(Pageable pageable);

    Page<UserDto> getAllDispatchers(Long customerId, Pageable pageable);

    void setWarehouseIntoUser(Warehouse warehouse, List<Long> usersId);
}

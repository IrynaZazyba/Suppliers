package by.itech.lab.supplier.service;

import by.itech.lab.supplier.domain.Role;
import by.itech.lab.supplier.domain.Warehouse;
import by.itech.lab.supplier.dto.CustomerDto;
import by.itech.lab.supplier.dto.UserDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface UserService extends BaseService<UserDto>{

    UserDto createAdmin(CustomerDto customerDto);


    UserDto findByUsername(String username);

    Page<UserDto> findAll(Pageable pageable);

    Page<UserDto> findAllByActive(Pageable pageable, Boolean status);

    UserDto save(UserDto userDTO);

    void delete(Long id);

    int changeActiveStatus(Long id, Boolean status);

    int changeActive(Long id);

    int changePassword(Long id, String password);

    Page<UserDto> getAllActive(Pageable pageable, Boolean status);

    Page<UserDto> getAllDispatchers(Long customerId, Pageable pageable);

    void setWarehouseIntoUser(Warehouse warehouse, List<Long> usersId);

    List<UserDto> findAllByRole(Role role);
}

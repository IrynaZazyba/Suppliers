package by.itech.lab.supplier.service;

import by.itech.lab.supplier.domain.Warehouse;
import by.itech.lab.supplier.dto.CustomerDto;
import by.itech.lab.supplier.dto.UserDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface UserService extends BaseService<UserDto> {
    List<UserDto> findListByDispatcherUsername(String username);

    List<UserDto> findDispatchersByWarehouseId(Long id);

    UserDto createAdmin(CustomerDto customerDto);


    UserDto findByUsername(String username);

    Page<UserDto> findAll(Pageable pageable);

    Page<UserDto> findAllByActive(Pageable pageable, Boolean status);

    UserDto save(UserDto userDTO);

    void delete(Long id);

    int changeActiveStatus(Long id, Boolean status);

    int changePassword(Long id, String password);

    Page<UserDto> getAllActive(Pageable pageable, Boolean status);

    void setWarehouseIntoUser(Warehouse warehouse, List<Long> usersId);

    void deleteWarehouseFromUsers(List<Long> dispatchers);

    void deleteWarehousesForAllUsers(List<Long> warehouses);
}

package by.itech.lab.supplier.controller;

import by.itech.lab.supplier.constant.ApiConstants;
import by.itech.lab.supplier.dto.CustomerDto;
import by.itech.lab.supplier.dto.StateDto;
import by.itech.lab.supplier.dto.UserDto;
import by.itech.lab.supplier.service.CustomerService;
import by.itech.lab.supplier.service.UserService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import javax.validation.Valid;
import java.util.Optional;

import static by.itech.lab.supplier.constant.ApiConstants.URL_CUSTOMER;
import static by.itech.lab.supplier.constant.ApiConstants.URL_CUSTOMER_ID;
import static by.itech.lab.supplier.constant.ApiConstants.URL_USER;

@RestController
@Slf4j
@AllArgsConstructor
@RequestMapping(URL_CUSTOMER + URL_CUSTOMER_ID + URL_USER)
public class UserController {

    private final UserService userService;
    private final CustomerService customerService;

    @GetMapping("/dispatchers")
    public Page<UserDto> getAllDispatchers(@PathVariable Long customerId, @PageableDefault Pageable pageable) {
        return userService.getAllDispatchers(customerId, pageable);
    }

    @GetMapping(ApiConstants.URL_ID_PARAMETER)
    public Optional<UserDto> getUser(@PathVariable Long id) {
        log.debug("request to get User : {}", id);
        return userService.findById(id);
    }


    @GetMapping
    public Page<UserDto> getAllByActive(
            @PageableDefault(sort = {"id"}, direction = Sort.Direction.DESC) final Pageable pageable,
            @RequestParam(required = false) final Boolean status) {
        return userService.findAllByActive(pageable, status);
    }


    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public UserDto createUser(@Valid @RequestBody UserDto userDto) {
       CustomerDto customerDto = customerService.findById(userDto.getCustomerId());
       userDto.setCustomerDto(customerDto);
        return userService.save(userDto);
    }


    @ResponseStatus(HttpStatus.OK)
    @PutMapping(ApiConstants.URL_ID_PARAMETER + ApiConstants.URL_PASSWORD_PARAMETER)
    public int changePassword(@PathVariable Long id, @PathVariable String password) {
        return userService.changePassword(id, password);
    }

    @PutMapping(ApiConstants.URL_ID_PARAMETER)
    @ResponseStatus(HttpStatus.OK)
    public UserDto updateUser(@PathVariable Long id, @Valid @RequestBody UserDto userDTO) {
        userDTO.setId(id);
        return userService.save(userDTO);
    }

    @ResponseStatus(HttpStatus.OK)
    @PutMapping(ApiConstants.URL_ID_PARAMETER + ApiConstants.URL_STATUS)
    public void changeActive(@PathVariable Long id, @RequestBody boolean status) {
        userService.changeActiveStatus(id, status);
    }

    @DeleteMapping(ApiConstants.URL_ID_PARAMETER)
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteUser(@PathVariable Long id) {
        userService.delete(id);
    }

}

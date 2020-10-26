package by.itech.lab.supplier.controller;

import by.itech.lab.supplier.constant.ApiConstants;
import by.itech.lab.supplier.dto.UserDto;
import by.itech.lab.supplier.service.UserService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;

@RestController
@Slf4j
@AllArgsConstructor
@RequestMapping(ApiConstants.URL_USER)
public class UserController {

    @Autowired
    private final UserService userService;


    @GetMapping(ApiConstants.URL_ID_PARAMETER)
    public UserDto getUser(@PathVariable Long id) {
        log.debug("request to get User : {}", id);
        if (userService.getUserWithAuthoritiesById(id).isPresent()) {
            return userService.getUserWithAuthoritiesById(id).get();
        } else throw new RuntimeException("problem while retrieving user");

    }

    @GetMapping
    public Page<UserDto> getAllUsers(@PageableDefault Pageable pageable) {
        return userService.getAll(pageable);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public UserDto createUser(@Valid @RequestBody UserDto userDto) {
        return userService.saveUser(userDto);
    }

    @ResponseStatus(HttpStatus.OK)
    @PutMapping(ApiConstants.URL_ID_PARAMETER + ApiConstants.URL_STATUS_PARAMETER)
    public boolean changeActiveStatus(@PathVariable Long id, @PathVariable boolean status) {
        return userService.changeActiveStatus(id, status);
    }

    @PutMapping(ApiConstants.URL_ID_PARAMETER)
    @ResponseStatus(HttpStatus.OK)
    public UserDto updateUser(@PathVariable Long id, @Valid @RequestBody UserDto userDTO) {
        userDTO.setId(id);
        return userService.saveUser(userDTO);
    }

    @DeleteMapping(ApiConstants.URL_ID_PARAMETER)
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
    }
}
package by.itech.lab.supplier.controller;

import by.itech.lab.supplier.advisor.AdminAccess;
import by.itech.lab.supplier.constant.ApiConstants;
import by.itech.lab.supplier.dto.UserDto;
import by.itech.lab.supplier.service.UserService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import javax.validation.Valid;
import java.util.Optional;

@RestController
@Slf4j
@AllArgsConstructor
@RequestMapping(ApiConstants.URL_USER)
public class UserController {

    private final UserService userService;

    @GetMapping(ApiConstants.URL_ID_PARAMETER)
    public Optional<UserDto> getUser(@PathVariable Long id) {
        log.debug("request to get User : {}", id);
        return userService.findById(id);
    }

    @GetMapping
    public Page<UserDto> getAllUsers(@PageableDefault Pageable pageable) {
        return userService.findAll(pageable);
    }

    @GetMapping(ApiConstants.URL_FILTERED)
    public Page<UserDto> getAllEnabledUsers(@PageableDefault Pageable pageable) {
        return userService.getAllActive(pageable);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @AdminAccess
    public UserDto createUser(@Valid @RequestBody UserDto userDto) {
        return userService.save(userDto);
    }

    @ResponseStatus(HttpStatus.OK)
    @PutMapping(ApiConstants.URL_ID_PARAMETER + ApiConstants.URL_STATUS_PARAMETER)
    @AdminAccess
    public int changeActiveStatus(@PathVariable Long id, @PathVariable boolean status) {
        return userService.changeActiveStatus(id, status);
    }

    //todo add secured when change url
    @PutMapping(ApiConstants.URL_ID_PARAMETER)
    @ResponseStatus(HttpStatus.OK)
    public UserDto updateUser(@PathVariable Long id, @Valid @RequestBody UserDto userDTO) {
        userDTO.setId(id);
        return userService.save(userDTO);
    }

    @DeleteMapping(ApiConstants.URL_ID_PARAMETER)
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @AdminAccess
    public void deleteUser(@PathVariable Long id) {
        userService.delete(id);
    }

}

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
import org.springframework.http.ResponseEntity;
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
import java.util.Optional;

@RestController
@Slf4j
@AllArgsConstructor
@RequestMapping(ApiConstants.URL_USER)
public class UserController {

    private final String URL_STATUS_PARAMETER = "/{status}";

    @Autowired
    private final UserService userService;


    @GetMapping(ApiConstants.URL_ID_PARAMETER)
    public ResponseEntity<UserDto> getUser(@PathVariable Long id) {
        log.debug("request to get User : {}", id);
        UserDto userDto = userService.getUserWithAuthoritiesById(id).get();
        return new ResponseEntity<>(userDto, HttpStatus.OK);
    }

    @GetMapping
    public Page<UserDto> getAllUsers(@PageableDefault(size = 10) Pageable pageable) {
        return userService.getAll(pageable);
    }

    @PostMapping
    public ResponseEntity<UserDto> createUser(@Valid @RequestBody UserDto userDto) {
        return new ResponseEntity<>(userService.createUser(userDto), HttpStatus.CREATED);
    }

    @PutMapping(ApiConstants.URL_ID_PARAMETER + URL_STATUS_PARAMETER)
    public ResponseEntity<UserDto> changeActiveStatus(@PathVariable Long id, @PathVariable boolean status) {
        Optional<UserDto> userDto = userService.changeActiveStatus(id, status);
        return new ResponseEntity<>(userDto.get(), HttpStatus.OK);
    }

    @PutMapping(ApiConstants.URL_ID_PARAMETER)
    public ResponseEntity<UserDto> updateUser(@PathVariable Long id, @Valid @RequestBody UserDto userDTO) {
        userDTO.setId(id);
        return new ResponseEntity<>(userService.updateUser(userDTO).get(), HttpStatus.OK);
    }

    @DeleteMapping(ApiConstants.URL_ID_PARAMETER)
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
    }
}
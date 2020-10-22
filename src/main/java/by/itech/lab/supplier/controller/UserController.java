package by.itech.lab.supplier.controller;

import by.itech.lab.supplier.constant.ApiConstants;
import by.itech.lab.supplier.domain.User;
import by.itech.lab.supplier.dto.UserDto;
import by.itech.lab.supplier.service.UserService;
import by.itech.lab.supplier.service.validator.IdValidator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
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
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;

@CrossOrigin
@RestController
@RequestMapping(ApiConstants.URL_APPLICATION)
public class UserController {
    private final Logger log = LoggerFactory.getLogger(UserController.class);

    private final UserService userService;

    //  private final MailService mailService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
        //      this.mailService = mailService;
    }

    @GetMapping("/" + ApiConstants.URL_USER + "/{id}")
    public ResponseEntity<UserDto> getUser(@PathVariable @Valid Long id) {
        IdValidator.validate(id);
        log.debug("request to get User : {}", id);
        UserDto userDto = userService.getUserWithAuthoritiesById(id).get();
        return new ResponseEntity<>(userDto, HttpStatus.OK);
    }

    @GetMapping(ApiConstants.URL_USER)
    public ResponseEntity<List<UserDto>> getAllUsers(Pageable pageable) {
        final Page<UserDto> page = userService.getAllManagedUsers(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/users");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    @PostMapping(ApiConstants.URL_USER)
    public ResponseEntity<UserDto> createUser(@Valid @RequestBody UserDto userDto) throws URISyntaxException {
        UserDto newUser = userService.createUser(userDto);
        // call service to send mail
        return ResponseEntity.created(new URI("/api/users/" + newUser.getUsername())).body(newUser);
    }

    @PutMapping("/" + ApiConstants.URL_USER + "/{id}")
    public ResponseEntity<UserDto> updateUser(@PathVariable Long id, @Valid @RequestBody UserDto userDTO) {
        IdValidator.validate(id);
        userDTO.setId(id);
        return new ResponseEntity<>(userService.updateUser(userDTO).get(), HttpStatus.OK);
    }

    @DeleteMapping("/" + ApiConstants.URL_USER + "/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteUser(@PathVariable @Valid Long id) {
        IdValidator.validate(id);
        userService.deleteUser(id);
    }
}
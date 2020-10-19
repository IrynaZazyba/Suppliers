package by.itech.lab.supplier.controller;

import by.itech.lab.supplier.domain.User;
import by.itech.lab.supplier.dto.UserDto;
import by.itech.lab.supplier.repository.UserRepository;

import by.itech.lab.supplier.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;

@CrossOrigin
@RestController
@RequestMapping("/api")
public class UserController {

    private final Logger log = LoggerFactory.getLogger(UserController.class);


    private final UserService userService;

    private final UserRepository userRepository;

 //  private final MailService mailService;



    @Autowired
    public UserController(UserService userService, UserRepository userRepository) {

        this.userService = userService;
        this.userRepository = userRepository;
  //      this.mailService = mailService;

    }



    @PostMapping("/users")
  //  @PreAuthorize("hasRole(\"" + AuthoritiesConstants.ADMIN + "\")")
    public ResponseEntity<User> createUser(@Valid @RequestBody UserDto userDto) throws URISyntaxException {
        log.debug("REST request to save User : {}", userDto);

        if (userDto.getId() != null) {
            throw new RuntimeException("");
              // Lowercase the user login before comparing with database
        } else if (userRepository.findOneByUsername(userDto.getUsername().toLowerCase()).isPresent()) {
            throw new RuntimeException("");
        } else if (userRepository.findOneByEmailIgnoreCase(userDto.getEmail()).isPresent()) {
          throw new RuntimeException("");
        } else {
            User newUser = userService.createUser(userDto);
           // mailService.sendCreationEmail(newUser);
            return ResponseEntity.created(new URI("/api/users/" + newUser.getUsername())).body(newUser);
        }
    }


    @PutMapping("/users")
 //   @PreAuthorize("hasRole(\"" + admin + "\")")
    public ResponseEntity<UserDto> updateUser(@Valid @RequestBody UserDto userDTO) {
        log.debug("REST request to update User : {}", userDTO);
        Optional<User> existingUser = userRepository.findOneByEmailIgnoreCase(userDTO.getEmail());
        if (existingUser.isPresent() && (!existingUser.get().getId().equals(userDTO.getId()))) {
            throw new RuntimeException("");
        }
        existingUser = userRepository.findOneByUsername(userDTO.getUsername().toLowerCase());
        if (existingUser.isPresent() && (!existingUser.get().getId().equals(userDTO.getId()))) {
            throw new RuntimeException("");
        }

        return  new ResponseEntity<>(userService.updateUser(userDTO).get(), HttpStatus.OK);
                }


//    @GetMapping("/users")
//    public ResponseEntity<List<UserDto>> getAllUsers(Pageable pageable) {
//        final Page<UserDto> page = userService.getAllManagedUsers(pageable);
//        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/users");
//        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
//    }





//  //  @GetMapping("/users/{login:" + Constants.LOGIN_REGEX + "}")
//    public ResponseEntity<UserDto> getUser(@PathVariable String login) {
//        log.debug("REST request to get User : {}", login);
//        return new ResponseEntity<>(
//                userService.getUserWithAuthoritiesByLogin(login)
//                        .map(UserDto::new));
//    }


    @DeleteMapping("/users/{login}")
  //  @PreAuthorize("hasRole(\"" + AuthoritiesConstants.ADMIN + "\")")
    public void deleteUser(@PathVariable String login) {
        log.debug("REST request to delete User: {}", login);
        userService.deleteUser(login);
       }


}
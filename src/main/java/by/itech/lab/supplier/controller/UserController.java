//package by.itech.lab.supplier.controller;
//
//import by.itech.lab.supplier.domain.User;
//import by.itech.lab.supplier.dto.UserDto;
//import by.itech.lab.supplier.repository.UserRepository;
//import by.itech.lab.supplier.repository.UserSearchRepository;
//import by.itech.lab.supplier.service.UserService;
//
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RestController;
//
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
//import org.springframework.data.domain.Page;
//import org.springframework.data.domain.Pageable;
//import org.springframework.http.HttpHeaders;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//import javax.validation.Valid;
//import java.net.URI;
//import java.net.URISyntaxException;
//import java.util.*;
//
//
//@RestController
//@RequestMapping("/api")
//public class UserController {
//
//    private final Logger log = LoggerFactory.getLogger(UserController.class);
//
//
//    private final UserService userService;
//
//    private final UserRepository userRepository;
//
// //  private final MailService mailService;
//
//    private final UserSearchRepository userSearchRepository;
//
//    public UserController(UserService userService, UserRepository userRepository,  UserSearchRepository userSearchRepository) {
//
//        this.userService = userService;
//        this.userRepository = userRepository;
//  //      this.mailService = mailService;
//        this.userSearchRepository = userSearchRepository;
//    }
//
//
//
//    @PostMapping("/users")
//  //  @PreAuthorize("hasRole(\"" + AuthoritiesConstants.ADMIN + "\")")
//    public ResponseEntity<User> createUser(@Valid @RequestBody UserDto userDto) throws URISyntaxException {
//        log.debug("REST request to save User : {}", userDto);
//
//        if (userDto.getId() != null) {
//            throw new BadRequestAlertException("A new user cannot already have an ID", "userManagement", "idexists");
//            // Lowercase the user login before comparing with database
//        } else if (userRepository.findOneByLogin(userDto.getLogin().toLowerCase()).isPresent()) {
//            throw new LoginAlreadyUsedException();
//        } else if (userRepository.findOneByEmailIgnoreCase(userDto.getEmail()).isPresent()) {
//            throw new EmailAlreadyUsedException();
//        } else {
//            User newUser = userService.createUser(userDto);
//           // mailService.sendCreationEmail(newUser);
//            return ResponseEntity.created(new URI("/api/users/" + newUser.getLogin()))
//
//                    .body(newUser);
//        }
//    }
//
//
//    @PutMapping("/users")
// //   @PreAuthorize("hasRole(\"" + AuthoritiesConstants.ADMIN + "\")")
//    public ResponseEntity<UserDto> updateUser(@Valid @RequestBody UserDto userDTO) {
//        log.debug("REST request to update User : {}", userDTO);
//        Optional<User> existingUser = userRepository.findOneByEmailIgnoreCase(userDTO.getEmail());
//        if (existingUser.isPresent() && (!existingUser.get().getId().equals(userDTO.getId()))) {
//            throw new EmailAlreadyUsedException();
//        }
//        existingUser = userRepository.findOneByLogin(userDTO.getLogin().toLowerCase());
//        if (existingUser.isPresent() && (!existingUser.get().getId().equals(userDTO.getId()))) {
//            throw new LoginAlreadyUsedException();
//        }
//        Optional<UserDto> updatedUser = userService.updateUser(userDTO);
//
//        return ResponseUtil.wrapOrNotFound(updatedUser,
//                HeaderUtil.createAlert("userManagement.updated", userDTO.getLogin()));
//    }
//
//
//    @GetMapping("/users")
//    public ResponseEntity<List<UserDto>> getAllUsers(Pageable pageable) {
//        final Page<UserDto> page = userService.getAllManagedUsers(pageable);
//        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/users");
//        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
//    }
//
//
// //   @GetMapping("/users/authorities")
// //   @PreAuthorize("hasRole(\"" + AuthoritiesConstants.ADMIN + "\")")
//  //  public List<String> getAuthorities() {
//        return userService.getAuthorities();
//    }
//
//
//  //  @GetMapping("/users/{login:" + Constants.LOGIN_REGEX + "}")
//    public ResponseEntity<UserDto> getUser(@PathVariable String login) {
//        log.debug("REST request to get User : {}", login);
//        return ResponseUtil.wrapOrNotFound(
//                userService.getUserWithAuthoritiesByLogin(login)
//                        .map(UserDto::new));
//    }
//
//
//    @DeleteMapping("/users/{login:" + Constants.LOGIN_REGEX + "}")
//  //  @PreAuthorize("hasRole(\"" + AuthoritiesConstants.ADMIN + "\")")
//    public ResponseEntity<Void> deleteUser(@PathVariable String login) {
//        log.debug("REST request to delete User: {}", login);
//        userService.deleteUser(login);
//        return ResponseEntity.ok().headers(HeaderUtil.createAlert("userManagement.deleted", login)).build();
//    }
//
//
//}
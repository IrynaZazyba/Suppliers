package by.itech.lab.supplier.auth.controller;

import by.itech.lab.supplier.auth.domain.LoginRequest;
import by.itech.lab.supplier.auth.domain.UserImpl;
import by.itech.lab.supplier.auth.dto.UserImplDto;
import by.itech.lab.supplier.auth.dto.UserImplMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserImplMapper userImplMapper;

    @PostMapping(value = "/login")
    public UserImplDto getUserCustomers(@RequestBody LoginRequest loginRequest) {
        UsernamePasswordAuthenticationToken authReq
                = new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword());
        Authentication auth = authenticationManager.authenticate(authReq);
        SecurityContext sc = SecurityContextHolder.getContext();
        sc.setAuthentication(auth);
        UserImpl principal = (UserImpl) sc.getAuthentication().getPrincipal();
        return userImplMapper.map(principal);
    }

}

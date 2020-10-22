package by.itech.lab.supplier.controller;

import by.itech.lab.supplier.auth.UserImpl;
import by.itech.lab.supplier.dto.CustomerDto;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import static by.itech.lab.supplier.constant.ApiConstants.URL_COMPANIES;
import static by.itech.lab.supplier.constant.ApiConstants.URL_USER;

@RestController
@AllArgsConstructor
@RequestMapping(URL_USER)
public class UserController {

    @ResponseStatus(HttpStatus.OK)
    @GetMapping(URL_COMPANIES)
    public List<CustomerDto> getUserCustomers() {
        UserImpl principal = (UserImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return principal.getCustomer();
    }
}

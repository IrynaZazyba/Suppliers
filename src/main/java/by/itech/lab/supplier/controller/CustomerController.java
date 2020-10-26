package by.itech.lab.supplier.controller;

import by.itech.lab.supplier.dto.CustomerDto;
import by.itech.lab.supplier.service.CustomerService;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Objects;

import static by.itech.lab.supplier.constant.ApiConstants.URL_CUSTOMER;
import static by.itech.lab.supplier.constant.ApiConstants.URL_CUSTOMER_ID;

@RestController
@AllArgsConstructor
@Secured(value = "ROLE_SYSTEM_ADMIN")
@RequestMapping(URL_CUSTOMER)
public class CustomerController {

    private final CustomerService customerService;

    @GetMapping
    public Page<CustomerDto> getCustomers(
            @PageableDefault(sort = {"id"}, direction = Sort.Direction.DESC) final Pageable pageable,
            @RequestParam(required = false) final String status) {
        Page<CustomerDto> allCustomers;
        if (Objects.isNull(status)) {
            allCustomers = customerService.getAllCustomers(pageable);
        } else {
            allCustomers = customerService.getCustomersFilteredByStatus(pageable, status);
        }
        return allCustomers;
    }

    @GetMapping(URL_CUSTOMER_ID)
    public CustomerDto getCustomer(@PathVariable final Long customerId) {
        return customerService.getCustomer(customerId);
    }
}


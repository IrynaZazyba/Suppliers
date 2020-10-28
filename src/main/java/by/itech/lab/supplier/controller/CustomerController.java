package by.itech.lab.supplier.controller;

import by.itech.lab.supplier.domain.Customer;
import by.itech.lab.supplier.dto.CustomerDto;
import by.itech.lab.supplier.service.CustomerService;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;


import javax.validation.Valid;
import java.util.List;

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
            @RequestParam(required = false) final Boolean status) {
        return customerService.getCustomers(pageable, status);
    }

    @GetMapping(URL_CUSTOMER_ID)
    public CustomerDto getCustomer(@PathVariable final Long customerId) {
        return customerService.getCustomer(customerId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CustomerDto createCustomer(@Valid @RequestBody CustomerDto customerDto) {
        return customerService.save(customerDto);
    }

//    @PostMapping
//    @ResponseStatus(HttpStatus.CREATED)
//    public ResponseEntity createCustomer(@Valid @RequestBody CustomerDto dto) {
//        customerService.save(dto);
//        return ResponseEntity.ok().build();
//    }



    @PutMapping
    public ResponseEntity updateStatus(@RequestBody List<CustomerDto> customerDtoList) {
        customerService.saveNewStatus(customerDtoList);
        return ResponseEntity.ok().build();
    }
}

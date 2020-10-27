package by.itech.lab.supplier.controller;

import by.itech.lab.supplier.domain.Customer;
import by.itech.lab.supplier.dto.CustomerDto;
import by.itech.lab.supplier.service.CustomerService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.util.List;

import static by.itech.lab.supplier.constant.ApiConstants.URL_CUSTOMER;

@CrossOrigin
@RestController
@AllArgsConstructor
@RequestMapping(URL_CUSTOMER)
public class CustomerController {

    private final CustomerService customerService;

    @PostMapping
    public ResponseEntity<Customer> createCustomer(@Valid @RequestBody CustomerDto dto) {
        Customer customer = customerService.saveOrEditCustomer(dto);
        return ResponseEntity.ok(customer);
    }

    @PutMapping
    public ResponseEntity changeActiveStatus(@RequestBody List<CustomerDto> customerDtoList) {
        customerService.changeActiveStatus(customerDtoList);
        return ResponseEntity.ok().build();
    }
}

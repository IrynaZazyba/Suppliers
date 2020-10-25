package by.itech.lab.supplier.controller;

import by.itech.lab.supplier.dto.CustomerDto;
import by.itech.lab.supplier.repository.CustomerRepository;
import by.itech.lab.supplier.service.CustomerService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import static by.itech.lab.supplier.constant.ApiConstants.URL_CUSTOMER;

@CrossOrigin
@RestController
@AllArgsConstructor
@RequestMapping(URL_CUSTOMER)
public class CustomerController {

    private final CustomerService customerService;
    private final CustomerRepository customerRepository;

    @PostMapping
    public void customerCreator(@RequestBody CustomerDto dto) {
        customerService.saveOrEditCustomer(dto);
        System.out.println(dto.getName());
    }
}

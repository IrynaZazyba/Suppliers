package by.itech.lab.supplier.controller;

import by.itech.lab.supplier.domain.Customer;
import by.itech.lab.supplier.dto.CustomerDto;
import by.itech.lab.supplier.dto.mapper.CustomerMapper;
import by.itech.lab.supplier.repository.CustomerRepository;
import by.itech.lab.supplier.service.CustomerService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

import static by.itech.lab.supplier.constant.ApiConstants.URL_CUSTOMER;

@RestController
@AllArgsConstructor
@RequestMapping(URL_CUSTOMER)
public class CustomerController {

    private final CustomerService customerService;
    private final CustomerRepository customerRepository;

    @PostMapping()
    public void customerCreator(@RequestBody CustomerDto dto){
        customerService.createNewCustomer(dto);
//        System.out.println(dto.getName());
    }

    @PostMapping()
    public void customerEditor(@RequestBody CustomerDto dto){
        Optional<Customer> optionalCustomer = customerRepository.findById(dto.getId());
        if (optionalCustomer.isPresent()) {
            customerService.editCustomer(dto);
        }

    }


}

package by.itech.lab.supplier.controller;

import by.itech.lab.supplier.dto.CustomerDto;
import by.itech.lab.supplier.repository.CustomerRepository;
import by.itech.lab.supplier.service.impl.CustomerServiceImp;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;
import static by.itech.lab.supplier.constant.ApiConstants.URL_CUSTOMER;

@RestController
@AllArgsConstructor
@RequestMapping(URL_CUSTOMER)
public class CustomerController {

    private final CustomerServiceImp customerServiceImp;
    private final CustomerRepository customerRepository;

    @PostMapping()
    public void customerCreator(@RequestBody CustomerDto dto){
//        System.out.println(dto.getName());
    }

//    @GetMapping(URL_CUSTOMER)
//    @PutMapping(URL_CUSTOMER)



}

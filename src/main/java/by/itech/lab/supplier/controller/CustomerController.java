package by.itech.lab.supplier.controller;

import by.itech.lab.supplier.dto.CustomerDto;
import by.itech.lab.supplier.service.CustomerService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;
import static by.itech.lab.supplier.constant.ApiConstants.URL_CUSTOMER;

@RestController
@AllArgsConstructor
@RequestMapping(URL_CUSTOMER)
public class CustomerController {

    private final CustomerService customerService;

    @PostMapping()
    public void customerCreator(@RequestBody CustomerDto dto){

    }

}

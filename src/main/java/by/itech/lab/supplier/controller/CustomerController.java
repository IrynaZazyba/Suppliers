package by.itech.lab.supplier.controller;

import by.itech.lab.supplier.dto.CustomerDto;
import by.itech.lab.supplier.service.CustomerService;
import lombok.AllArgsConstructor;
import org.apache.commons.lang3.ObjectUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import static by.itech.lab.supplier.constant.ApiConstants.URL_CUSTOMER;

@RestController
@AllArgsConstructor
@RequestMapping(URL_CUSTOMER)
public class CustomerController {

    private final CustomerService customerService;

    @GetMapping
    public Page<CustomerDto> getCustomers(
            @PageableDefault(sort = {"id"}, direction = Sort.Direction.DESC) Pageable pageable,
            @RequestParam(required = false) String status) {
        Page<CustomerDto> allCustomers;
        if (ObjectUtils.anyNull(status)) {
            allCustomers = customerService.getAllCustomers(pageable);
        } else {
            allCustomers = customerService.getFilteredByStatusCustomers(pageable, status);
        }
        return allCustomers;
    }
}

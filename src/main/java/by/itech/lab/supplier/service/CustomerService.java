package by.itech.lab.supplier.service;

import by.itech.lab.supplier.dto.CustomerDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import by.itech.lab.supplier.domain.Customer;
import by.itech.lab.supplier.dto.CustomerDto;

import java.util.List;

public interface CustomerService {

    Page<CustomerDto> getCustomers(Pageable pageable, Boolean status);

    CustomerDto getCustomer(Long customerId);
    Customer saveOrEditCustomer(CustomerDto dto);
    List<Customer> changeActiveStatus(List<CustomerDto> customers);
}




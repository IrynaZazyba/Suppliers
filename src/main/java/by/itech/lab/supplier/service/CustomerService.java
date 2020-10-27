package by.itech.lab.supplier.service;

import by.itech.lab.supplier.domain.Customer;
import by.itech.lab.supplier.dto.CustomerDto;

import java.util.List;

public interface CustomerService {
    Customer saveOrEditCustomer(CustomerDto dto);
    List<Customer> changeActiveStatus(List<CustomerDto> customers);
}

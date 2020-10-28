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
    Customer save(CustomerDto dto);
    List<Customer> saveNewStatus(List<CustomerDto> customers);
}




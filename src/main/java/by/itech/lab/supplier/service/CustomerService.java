package by.itech.lab.supplier.service;

import by.itech.lab.supplier.dto.CustomerDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import by.itech.lab.supplier.domain.Customer;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public interface CustomerService {

    Page<CustomerDto> getCustomers(Pageable pageable, Boolean status);
    CustomerDto getCustomer(Long customerId);
    CustomerDto save(CustomerDto dto);
    List<Customer> saveNewStatus(List<CustomerDto> customers);
}




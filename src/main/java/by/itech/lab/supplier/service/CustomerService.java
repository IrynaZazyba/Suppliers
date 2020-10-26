package by.itech.lab.supplier.service;

import by.itech.lab.supplier.dto.CustomerDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface CustomerService {

    Page<CustomerDto> getAllCustomers(Pageable pageable);

    Page<CustomerDto> getCustomersFilteredByStatus(Pageable pageable, Boolean status);

    CustomerDto getCustomer(Long customerId);
}




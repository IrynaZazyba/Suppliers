package by.itech.lab.supplier.service;

import by.itech.lab.supplier.dto.CustomerDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface CustomerService {

    Page<CustomerDto> getAllCustomers(Pageable pageable);

    Page<CustomerDto> getFilteredByStatusCustomers(Pageable pageable, String status);
}

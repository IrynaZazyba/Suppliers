package by.itech.lab.supplier.service.impl;

import by.itech.lab.supplier.dto.CustomerDto;
import by.itech.lab.supplier.dto.mapper.CustomerMapper;
import by.itech.lab.supplier.repository.CustomerRepository;
import by.itech.lab.supplier.service.CustomerService;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class DefaultCustomerService implements CustomerService {

    private final CustomerRepository customerRepository;
    private final CustomerMapper customerMapper;

    @Override
    public Page<CustomerDto> getAllCustomers(Pageable pageable) {
        return customerRepository.findAll(pageable).map(customerMapper::mapToCustomerView);
    }

    @Override
    public Page<CustomerDto> getCustomersFilteredByStatus(Pageable pageable, String status) {
        return customerRepository.findAllByStatus(pageable, status).map(customerMapper::mapToCustomerView);
    }

}

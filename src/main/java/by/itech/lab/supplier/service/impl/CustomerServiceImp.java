package by.itech.lab.supplier.service.impl;

import by.itech.lab.supplier.domain.Customer;
import by.itech.lab.supplier.dto.CustomerDto;
import by.itech.lab.supplier.dto.mapper.CustomerMapper;
import by.itech.lab.supplier.repository.CustomerRepository;
import by.itech.lab.supplier.service.CustomerService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class CustomerServiceImp implements CustomerService {

    private final CustomerRepository customerRepository;
    @Override
    public void createNewCustomer(CustomerDto dto) {
        Customer customer = new Customer();

        CustomerMapper customerMapper = new CustomerMapper();
        customerMapper.map(dto);

        customerRepository.save(customer);
    }
}

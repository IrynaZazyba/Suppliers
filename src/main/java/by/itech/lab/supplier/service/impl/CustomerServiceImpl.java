package by.itech.lab.supplier.service.impl;

import by.itech.lab.supplier.domain.Customer;
import by.itech.lab.supplier.dto.CustomerDto;
import by.itech.lab.supplier.dto.mapper.CustomerMapper;
import by.itech.lab.supplier.repository.CustomerRepository;
import by.itech.lab.supplier.service.CustomerService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Optional;

@Service
@AllArgsConstructor
public class CustomerServiceImpl implements CustomerService {

    private final CustomerRepository customerRepository;
    private final CustomerMapper customerMapper;

    @Override
    public void saveOrEditCustomer(CustomerDto dto) {
        Optional<Customer> optionalCustomer = customerRepository.findById(dto.getId());
        if (optionalCustomer.isPresent()) {
            customerRepository.save(customerMapper.map(dto));
        } else {
            Customer customer = customerMapper.map(dto);
            customer.setRegistrationDate(LocalDate.now());
            customer.setStatus(true);
            customerRepository.save(customer);
            // TODO: 10/26/20  createNewRole("Administrator");
        }
    }
}

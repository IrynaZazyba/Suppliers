package by.itech.lab.supplier.service.impl;

import by.itech.lab.supplier.domain.Customer;
import by.itech.lab.supplier.dto.CustomerDto;
import by.itech.lab.supplier.dto.mapper.CustomerMapper;
import by.itech.lab.supplier.exception.ResourceNotFoundException;
import by.itech.lab.supplier.repository.CustomerRepository;
import by.itech.lab.supplier.service.CustomerService;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.time.LocalDate;
import java.util.Optional;

@Service
@AllArgsConstructor
public class CustomerServiceImpl implements CustomerService {

    private final CustomerRepository customerRepository;
    private final CustomerMapper customerMapper;
    private final UserServiceImpl userService;

    @Override
    public Page<CustomerDto> findAll(final Pageable pageable, final Boolean status) {
        return customerRepository.findByStatus(pageable, status).map(customerMapper::mapToCustomerView);
    }

    @Override
    public CustomerDto findById(final Long customerId) {
        return customerRepository.findById(customerId)
                .map(customerMapper::mapToCustomerView)
                .orElseThrow(() -> new ResourceNotFoundException("Customer with id=" + customerId + " doesn't exist"));
    }

    @Override
    @Transactional
    public CustomerDto save(CustomerDto customerDto) {
        Customer customer = Optional.ofNullable(customerDto.getId())
                .map(item -> {
                    final Customer existing = customerRepository
                            .findById(customerDto.getId())
                            .orElseThrow();
                    customerMapper.map(customerDto, existing);
                    return existing;
                })
                .orElseGet(() -> customerMapper.map(customerDto));

        customer.setRegistrationDate(LocalDate.now());
        final Customer saved = customerRepository.save(customer);
        userService.save(userService.createAdmin(customerDto));
        return customerMapper.map(saved);
    }

    @Transactional
    public void delete(final Long id) {
        customerRepository.delete(id);
    }

    @Override
    @Transactional
    public boolean changeActive(Long id, boolean status) {
        return customerRepository.setStatus(status, id);
    }
}

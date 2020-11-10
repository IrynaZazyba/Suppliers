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
    public Page<CustomerDto> findAllByActive(final Pageable pageable, final Boolean status) {
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
                .map(item -> update(customerDto))
                .orElseGet(() -> create(customerDto));
        return customerMapper.map(customer);
    }

    private Customer create(CustomerDto customerDto) {
        Customer newCustomer = customerMapper.map(customerDto);
        newCustomer.setRegistrationDate(LocalDate.now());
        final Customer saved = customerRepository.save(newCustomer);
        customerDto.setId(saved.getId());
        userService.save(userService.createAdmin(customerDto));
        return saved;
    }

    private Customer update(CustomerDto customerDto) {
        final Customer existing = customerRepository
                .findById(customerDto.getId())
                .orElseThrow();
        customerMapper.map(customerDto, existing);
        return customerRepository.save(existing);
    }


    @Transactional
    public void delete(final Long id) {
        customerRepository.delete(id);
    }

    @Override
    @Transactional
    public void changeActive(Long id, boolean status) {
        customerRepository.setStatus(status, id);
    }
}

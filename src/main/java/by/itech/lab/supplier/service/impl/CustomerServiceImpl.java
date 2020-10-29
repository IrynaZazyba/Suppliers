package by.itech.lab.supplier.service.impl;

import by.itech.lab.supplier.domain.Customer;
import by.itech.lab.supplier.domain.Role;
import by.itech.lab.supplier.dto.CustomerDto;
import by.itech.lab.supplier.dto.UserDto;
import by.itech.lab.supplier.dto.mapper.CustomerMapper;
import by.itech.lab.supplier.exception.ResourceNotFoundException;
import by.itech.lab.supplier.repository.CustomerRepository;
import by.itech.lab.supplier.service.CustomerService;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import javax.transaction.Transactional;
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
    public CustomerDto save(CustomerDto customerDto) {
        Customer customer = Optional.ofNullable(customerDto.getId())
                .map(item -> {
                    final Customer existing = customerRepository
                            .findById(customerDto.getId())
                            .orElseThrow();
                    updateCustomer(customerDto, existing);
                    return existing;
                })
                .orElseGet(() -> customerMapper.map(customerDto));

        final Customer saved = customerRepository.save(customer);
        userService.save(createAdmin(customerDto));
        return customerMapper.map(saved);
    }

    private UserDto createAdmin(CustomerDto customerDto) {
        return UserDto.builder()
                .username("User name")
                .name("Name")
                .surname("Surname")
                .email(customerDto.getAdminEmail())
                .active(false)
                .role(Role.ROLE_ADMIN)
                .build();
    }

    private void updateCustomer(final CustomerDto from, final Customer to) {
        to.setName(from.getName());
        to.setRegistrationDate(from.getRegistrationDate());
        to.setStatus(from.isStatus());
    }

    @Transactional
    public void delete(final Long id) {
        customerRepository.delete(id);
    }

    @Transactional
    public void activate(final Long id) {
        customerRepository.activate(id);
    }
}

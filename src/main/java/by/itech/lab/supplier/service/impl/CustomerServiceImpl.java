package by.itech.lab.supplier.service.impl;

import by.itech.lab.supplier.dto.CustomerDto;
import by.itech.lab.supplier.dto.mapper.CustomerMapper;
import by.itech.lab.supplier.exception.ResourceNotFoundException;
import by.itech.lab.supplier.repository.CustomerRepository;
import by.itech.lab.supplier.service.CustomerService;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import by.itech.lab.supplier.domain.Customer;
import by.itech.lab.supplier.domain.Role;
import by.itech.lab.supplier.dto.CustomerDto;
import by.itech.lab.supplier.dto.UserDto;
import by.itech.lab.supplier.dto.mapper.CustomerMapper;
import by.itech.lab.supplier.repository.CustomerRepository;
import by.itech.lab.supplier.service.CustomerService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class CustomerServiceImpl implements CustomerService {

    private final CustomerRepository customerRepository;
    private final CustomerMapper customerMapper;
    private final UserServiceImpl userService;

    @Override
    public Page<CustomerDto> getCustomers(final Pageable pageable, final Boolean status) {
        return customerRepository.findByStatus(pageable, status).map(customerMapper::mapToCustomerView);
    }

    @Override
    public CustomerDto getCustomer(final Long customerId) {
        return customerRepository.findById(customerId)
                .map(customerMapper::mapToCustomerView)
                .orElseThrow(() -> new ResourceNotFoundException("Customer with id=" + customerId + " doesn't exist"));
    }

    @Override
    public Customer saveOrEditCustomer(CustomerDto dto) {
        Optional<Customer> optionalCustomer = customerRepository.findById(dto.getId());
        if (optionalCustomer.isPresent()) {
            customerRepository.save(customerMapper.map(dto));
        } else {
            Customer customer = customerMapper.map(dto);
            customer.setRegistrationDate(LocalDate.now());
            customer.setStatus(true);
            customerRepository.save(customer);
            userService.createUser(createAdmin());
        }
        return customerMapper.map(dto);
    }

    @Override
    public List<Customer> saveNewStatus(List<CustomerDto> customerDtoList) {
        List<Customer> customers = new ArrayList<>();
        for (CustomerDto customer : customerDtoList) {
            Customer customerFromDto = customerMapper.map(customer);
            customerRepository.save(customerFromDto);
            customers.add(customerFromDto);
        }
        return customers;
    }

    private UserDto createAdmin() {
        return UserDto.builder()
                .username("User name")
                .name("Name")
                .surname("Surname")
                .email("email")
                .active(false)
                .role(Role.ROLE_ADMIN)
                .build();
    }
}

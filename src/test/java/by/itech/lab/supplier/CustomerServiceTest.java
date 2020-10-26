package by.itech.lab.supplier;

import by.itech.lab.supplier.domain.Customer;
import by.itech.lab.supplier.dto.CustomerDto;
import by.itech.lab.supplier.dto.mapper.CustomerMapper;
import by.itech.lab.supplier.exception.ResourceNotFoundException;
import by.itech.lab.supplier.repository.CustomerRepository;
import by.itech.lab.supplier.service.CustomerService;
import by.itech.lab.supplier.service.impl.CustomerServiceImpl;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Bean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.sql.Date;
import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@ExtendWith(SpringExtension.class)
public class CustomerServiceTest {

    @Autowired
    private CustomerService customerService;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private CustomerMapper customerMapper;

    @TestConfiguration
    static class Config {

        @MockBean
        private CustomerRepository customerRepository;

        @MockBean
        private CustomerMapper customerMapper;

        @Bean
        public CustomerService customerService() {
            return new CustomerServiceImpl(customerRepository, customerMapper);
        }

    }

    private Customer customer;
    private CustomerDto customerDto;
    private PageRequest pageRequest;

    @BeforeEach
    void initializeCustomer() {
        customer = Customer.builder()
                .id(5L)
                .name("System")
                .registrationDate(Date.valueOf(LocalDate.now()))
                .status(true)
                .build();
        customerDto = CustomerDto.builder()
                .id(5L)
                .name("System")
                .registrationDate(LocalDate.now())
                .status(true)
                .build();
        pageRequest = PageRequest.of(1, 10);
    }

    @Test
    void getAllCustomersTest() {
        List<Customer> customerList = Collections.singletonList(customer);
        List<CustomerDto> customerDtos = Collections.singletonList(customerDto);
        Page<CustomerDto> customerDtoPage = new PageImpl<>(customerDtos);
        Page<Customer> customerPage = new PageImpl<>(customerList);

        Mockito.when(customerRepository.findByStatus(pageRequest,null)).thenReturn(customerPage);
        Mockito.when(customerMapper.mapToCustomerView(customer)).thenReturn(customerDto);

        Assertions.assertEquals(customerDtoPage, customerService.getCustomers(pageRequest,null));
    }

    @Test
    void getCustomersFilteredByStatusTest() {
        List<Customer> customerList = Collections.singletonList(customer);
        List<CustomerDto> customerDtos = Collections.singletonList(customerDto);
        Page<CustomerDto> customerDtoPage = new PageImpl<>(customerDtos);
        Page<Customer> customerPage = new PageImpl<>(customerList);

        Mockito.when(customerRepository.findByStatus(pageRequest, true)).thenReturn(customerPage);
        Mockito.when(customerMapper.mapToCustomerView(customer)).thenReturn(customerDto);

        Assertions.assertEquals(customerDtoPage, customerService.getCustomers(pageRequest, true));
    }

    @Test
    void getCustomerTest_Positive() {
        Mockito.when(customerRepository.findById(5L)).thenReturn(Optional.of(customer));
        Mockito.when(customerMapper.mapToCustomerView(customer)).thenReturn(customerDto);

        Assertions.assertEquals(customerDto, customerService.getCustomer(5L));
    }

    @Test
    void getCustomerTest_Negative() {
        Mockito.when(customerRepository.findById(5L)).thenReturn(Optional.empty());
        Mockito.when(customerMapper.mapToCustomerView(customer)).thenReturn(customerDto);

        Assertions.assertThrows(ResourceNotFoundException.class, () -> customerService.getCustomer(5L));
    }

}


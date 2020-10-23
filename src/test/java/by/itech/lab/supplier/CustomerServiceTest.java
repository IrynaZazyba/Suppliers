package by.itech.lab.supplier;

import by.itech.lab.supplier.domain.Customer;
import by.itech.lab.supplier.dto.CustomerDto;
import by.itech.lab.supplier.dto.mapper.CustomerMapper;
import by.itech.lab.supplier.repository.CustomerRepository;
import by.itech.lab.supplier.service.CustomerService;
import by.itech.lab.supplier.service.impl.DefaultCustomerService;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mockito;
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

@ExtendWith(SpringExtension.class)
public class CustomerServiceTest {

//    @Autowired
//    private CustomerService customerService;

    @MockBean
    private CustomerRepository customerRepository;

    @MockBean
    private CustomerMapper customerMapper;


    @Bean
    public CustomerService customerService() {
        return new DefaultCustomerService(customerRepository, customerMapper);
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
                .status("active")
                .build();
        customerDto = CustomerDto.builder()
                .id(5L)
                .name("System")
                .registrationDate(LocalDate.now())
                .status("active")
                .build();
        pageRequest = PageRequest.of(1, 10);
    }

    @Test
    void getAllCustomersTest() {
        List<Customer> customerList = Collections.singletonList(customer);
        List<CustomerDto> customerDtos = Collections.singletonList(customerDto);
        Page<CustomerDto> customerDtoPage = new PageImpl<>(customerDtos);
        Page<Customer> customerPage = new PageImpl<>(customerList);
        Mockito.when(customerRepository.findAll(pageRequest)).thenReturn(customerPage);
        Mockito.when(customerMapper.mapToCustomerView(customer)).thenReturn(customerDto);
        Assertions.assertEquals(customerDtoPage, customerService().getAllCustomers(pageRequest));
    }

    @Test
    void getCustomersFilteredByStatusTest() {
        String status = "active";
        List<Customer> customerList = Collections.singletonList(customer);
        List<CustomerDto> customerDtos = Collections.singletonList(customerDto);
        Page<CustomerDto> customerDtoPage = new PageImpl<>(customerDtos);
        Page<Customer> customerPage = new PageImpl<>(customerList);
        Mockito.when(customerRepository.findAllByStatus(pageRequest, status)).thenReturn(customerPage);
        Mockito.when(customerMapper.mapToCustomerView(customer)).thenReturn(customerDto);
        Assertions.assertEquals(customerDtoPage, customerService().getCustomersFilteredByStatus(pageRequest, status));
    }


}

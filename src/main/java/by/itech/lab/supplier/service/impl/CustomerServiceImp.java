package by.itech.lab.supplier.service.impl;

import by.itech.lab.supplier.domain.Customer;
import by.itech.lab.supplier.dto.CustomerDto;
import by.itech.lab.supplier.dto.mapper.CustomerMapper;
import by.itech.lab.supplier.repository.CustomerRepository;
import by.itech.lab.supplier.service.CustomerService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@Service
@AllArgsConstructor
public class CustomerServiceImp implements CustomerService {

    private final CustomerRepository customerRepository;
    private final CustomerMapper customerMapper;

    @Override
    public void createNewCustomer(CustomerDto dto) {
        Customer customer = new Customer();
        Customer customerDto = customerMapper.map(dto);
        dto.setId(customer.getId());
        DateTimeFormatter dtf = DateTimeFormatter.ofPattern("yyyy/MM/dd");
        LocalDate localDate = LocalDate.now();
        dto.setRegistrationDate(LocalDate.parse(dtf.format(localDate)));
        dto.setStatus("active");
        customerRepository.save(customerDto);
    }

    @Override
    public void editCustomer(CustomerDto dto) {
        Customer customerDto = customerMapper.map(dto);
        customerRepository.save(customerDto);
    }
}

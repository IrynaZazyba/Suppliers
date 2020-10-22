package by.itech.lab.supplier.service.impl;

import by.itech.lab.supplier.domain.Customer;
import by.itech.lab.supplier.dto.CustomerDto;
import by.itech.lab.supplier.repository.CustomerRepositoryImp;
import by.itech.lab.supplier.service.CustomerService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.Date;

@Service
@AllArgsConstructor
public class CustomerServiceImp implements CustomerService {

    @Override
    public void createNewCustomer(CustomerDto dto) {
        Customer customer = new Customer();

//        Long id = customer.getId();
//        customer.setId(id);
        customer.setName(dto.getName());
        Date date = new Date();
        customer.setRegistrationDate(date);
        customer.setStatus("active");

        CustomerRepositoryImp customerRepository = new CustomerRepositoryImp();
        customerRepository.save(customer);
    }
}

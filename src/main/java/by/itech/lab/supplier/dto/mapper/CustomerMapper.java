package by.itech.lab.supplier.dto.mapper;

import by.itech.lab.supplier.domain.Customer;
import by.itech.lab.supplier.domain.Role;
import by.itech.lab.supplier.domain.User;
import by.itech.lab.supplier.dto.CustomerDto;
import by.itech.lab.supplier.exception.ResourceNotFoundException;
import org.springframework.stereotype.Component;

import java.sql.Date;

@Component
public class CustomerMapper implements BaseMapper<Customer, CustomerDto> {

    @Override
    public Customer map(CustomerDto dto) {
        return Customer.builder()
                .id(dto.getId())
                .name(dto.getName())
                .registrationDate(Date.valueOf(dto.getRegistrationDate()))
                .status(dto.isStatus())
                .build();
    }

    @Override
    public CustomerDto map(Customer entity) {
        return CustomerDto.builder()
                .id(entity.getId())
                .name(entity.getName())
                .registrationDate(entity.getRegistrationDate().toLocalDate())
                .status(entity.isStatus())
                .build();
    }

    public CustomerDto mapToCustomerView(Customer entity) {
        User admin = entity.getUsers()
                .stream()
                .filter(customer -> Role.ROLE_ADMIN == customer.getRole() || Role.ROLE_SYSTEM_ADMIN == customer.getRole())
                .findAny()
                .orElseThrow(() -> new ResourceNotFoundException(Role.ROLE_ADMIN.getRole() + " doesn't exist at current customer"));
        CustomerDto customerDto = map(entity);
        customerDto.setAdminEmail(admin.getEmail());
        return customerDto;
    }
}


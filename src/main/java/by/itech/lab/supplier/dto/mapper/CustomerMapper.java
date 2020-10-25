package by.itech.lab.supplier.dto.mapper;

import by.itech.lab.supplier.domain.Customer;
import by.itech.lab.supplier.dto.CustomerDto;
import org.springframework.stereotype.Component;

@Component
public class CustomerMapper implements BaseMapper<Customer, CustomerDto> {

    @Override
    public Customer map(CustomerDto dto) {
        return Customer.builder()
                .id(dto.getId())
                .name(dto.getName())
                .registrationDate(dto.getRegistrationDate())
                .active(dto.isActive())
                .build();
    }

    @Override
    public CustomerDto map(Customer entity) {
        return CustomerDto.builder()
                .id(entity.getId())
                .name(entity.getName())
                .registrationDate(entity.getRegistrationDate())
                .active(entity.isActive())
                .build();
    }
}

package by.itech.lab.supplier.service;

import by.itech.lab.supplier.dto.CustomerDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import org.springframework.stereotype.Service;
import java.util.List;

@Service
public interface CustomerService extends BaseService<CustomerDto> {

    Page<CustomerDto> getCustomers(Pageable pageable, Boolean status);
    CustomerDto getCustomer(Long customerId);
    void saveNewStatus(List<CustomerDto> customers);
}




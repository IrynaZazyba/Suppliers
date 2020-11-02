package by.itech.lab.supplier.service;

import by.itech.lab.supplier.dto.CustomerDto;

public interface CustomerService extends BaseService<CustomerDto> {

    boolean changeActive(Long id, boolean status);
}




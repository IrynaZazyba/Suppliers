package by.itech.lab.supplier.service;

import by.itech.lab.supplier.dto.CustomerDto;

public interface CustomerService extends BaseService<CustomerDto> {

    boolean changeActiveStatus(Long id, boolean status);
}




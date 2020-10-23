package by.itech.lab.supplier.service;

import by.itech.lab.supplier.dto.CustomerDto;

public interface CustomerService {
    void createNewCustomer(CustomerDto dto);

    void editCustomer(CustomerDto dto);
}

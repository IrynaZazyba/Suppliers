package by.itech.lab.supplier.service;

import by.itech.lab.supplier.dto.CustomerDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface CustomerService extends BaseService<CustomerDto> {

    boolean changeActive(Long id, boolean status);

    Page<CustomerDto> findAllByActive(final Pageable pageable, final Boolean status);

}

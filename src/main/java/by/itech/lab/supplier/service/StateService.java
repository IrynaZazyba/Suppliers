package by.itech.lab.supplier.service;

import by.itech.lab.supplier.dto.StateDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface StateService{
    Page<StateDto> findAll(Pageable pageable);
}

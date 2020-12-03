package by.itech.lab.supplier.service;

import by.itech.lab.supplier.dto.StateDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface StateService{

    List<StateDto> findListByState(String state);

    Page<StateDto> findAll(Pageable pageable);
}

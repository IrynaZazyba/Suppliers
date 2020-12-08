package by.itech.lab.supplier.service;

import by.itech.lab.supplier.dto.UsStateDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface UsStateService {

    List<UsStateDto> findListByState(String state);

    Page<UsStateDto> findAll(Pageable pageable);
}

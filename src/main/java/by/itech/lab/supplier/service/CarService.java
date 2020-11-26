package by.itech.lab.supplier.service;

import by.itech.lab.supplier.dto.CarDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface CarService extends BaseService<CarDto> {

    Page<CarDto> findAll(Pageable pageable);

}

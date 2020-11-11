package by.itech.lab.supplier.service;

import by.itech.lab.supplier.dto.BaseDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface BaseSimpleService<Dto extends BaseDto> extends BaseService<Dto> {

    Page<Dto> findAll(Pageable pageable);

}

package by.itech.lab.supplier.service;

import by.itech.lab.supplier.dto.BaseDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface Service<Dto extends BaseDto> {
    Dto save(final Dto dto);

    Page<Dto> readAll(Pageable pageable);

    Dto findById(final Long id);

    void delete(final Long id);

    void activate(final Long id);
}

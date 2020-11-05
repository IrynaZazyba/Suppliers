package by.itech.lab.supplier.service;

import by.itech.lab.supplier.dto.BaseDto;

public interface BaseService<Dto extends BaseDto> {
    Dto save(final Dto dto);

    Dto findById(final Long id);

    void delete(final Long id);
}

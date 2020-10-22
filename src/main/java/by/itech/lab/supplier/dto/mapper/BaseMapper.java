package by.itech.lab.supplier.dto.mapper;

import by.itech.lab.supplier.domain.BaseEntity;
import by.itech.lab.supplier.dto.BaseDto;

public interface BaseMapper<E extends BaseEntity, D extends BaseDto> {

    E map(final D dto);

    D map(final E entity);

}

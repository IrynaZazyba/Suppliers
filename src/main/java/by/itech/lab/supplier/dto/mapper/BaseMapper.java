package by.itech.lab.supplier.dto.mapper;

import by.itech.lab.supplier.domain.BaseEntity;
import by.itech.lab.supplier.dto.DefaultDto;

public interface BaseMapper<E extends BaseEntity, D extends DefaultDto> {

    E map(final D dto);

    D map(final E entity);

}

package by.itech.lab.supplier.service;

import by.itech.lab.supplier.dto.CategoryDto;
import by.itech.lab.supplier.dto.ItemDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ItemService extends BaseService<ItemDto> {

    ItemDto findByLabel(String label);

    Page<ItemDto> findAllByCategory(String categoryName, Pageable pageable);

    Page<ItemDto> findAllByActive(Pageable pageable, Boolean active);

    void deactivate(final Long id);

    void activate(final Long id);

}

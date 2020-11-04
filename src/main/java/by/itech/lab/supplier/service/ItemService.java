package by.itech.lab.supplier.service;

import by.itech.lab.supplier.dto.ItemDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ItemService extends BaseService<ItemDto> {

    Page<ItemDto> findByLabel(String label, Pageable pageable);

    Page<ItemDto> findAllByCategory(String categoryName, Pageable pageable);

}

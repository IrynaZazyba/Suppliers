package by.itech.lab.supplier.service;

import by.itech.lab.supplier.dto.CategoryDto;
import by.itech.lab.supplier.dto.ItemDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ItemService extends BaseService<ItemDto> {

    ItemDto findByLabel(String label);

    Page<ItemDto> findAllByCategory(CategoryDto categoryDto, Pageable pageable);

}

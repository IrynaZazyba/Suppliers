package by.itech.lab.supplier.service;

import by.itech.lab.supplier.dto.ItemDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ItemService extends BaseSimpleService<ItemDto> {

    Page<ItemDto> findByLabel(String label, Pageable pageable);

    Page<ItemDto> findAllByCategory(String categoryName, Pageable pageable);

    ItemDto save(ItemDto dto);

    List<ItemDto> findByUpc(String upc);
}

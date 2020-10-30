package by.itech.lab.supplier.service.impl;

import by.itech.lab.supplier.domain.Item;
import by.itech.lab.supplier.dto.CategoryDto;
import by.itech.lab.supplier.dto.ItemDto;
import by.itech.lab.supplier.dto.mapper.ItemMapper;
import by.itech.lab.supplier.exception.NotFoundInDBException;
import by.itech.lab.supplier.repository.ItemRepository;
import by.itech.lab.supplier.service.CategoryService;
import by.itech.lab.supplier.service.ItemService;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.Optional;

@Service
@AllArgsConstructor
public class ItemServiceImpl implements ItemService {

    private final ItemRepository itemRepository;

    private final ItemMapper itemMapper;

    private final CategoryService categoryService;

    @Override
    public ItemDto findByLabel(final String label) {
        return itemRepository.findByLabel(label)
          .map(itemMapper::map).orElseThrow(NotFoundInDBException::new);
    }

    public Page<ItemDto> findAllByCategory(final String categoryName, final Pageable pageable) {
        CategoryDto found = categoryService.findByCategory(categoryName);
        return itemRepository.findAllByCategory(found.getId(), pageable)
          .map(itemMapper::map);
    }

    @Override
    public Page<ItemDto> findAllByActive(final Pageable pageable, final Boolean active) {
        return itemRepository.findAllByActive(pageable, active)
          .map(itemMapper::map);
    }

    public ItemDto save(final ItemDto dto) {
        Item item = Optional.ofNullable(dto.getId())
          .map(itemToSave -> {
              final Item existing = itemRepository
                .findById(dto.getId())
                .orElseThrow();
              itemMapper.update(dto, existing);
              return existing;
          })
          .orElseGet(() -> itemMapper.map(dto));

        final Item saved = itemRepository.save(item);
        return itemMapper.map(saved);
    }

    @Override
    public Page<ItemDto> findAllByDeleted(Pageable pageable, Boolean deleted) {
        return null;
    }

    public ItemDto findById(final Long id) {
        return itemRepository.findById(id).map(itemMapper::map)
          .orElseThrow(NotFoundInDBException::new);
    }

    @Override
    public void delete(Long id) {

    }

    @Transactional
    public void deactivate(final Long id) {
        itemRepository.deactivate(id);
    }

    @Transactional
    public void activate(final Long id) {
        itemRepository.activate(id);
    }

}

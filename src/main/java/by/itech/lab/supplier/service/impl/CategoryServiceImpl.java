package by.itech.lab.supplier.service.impl;

import by.itech.lab.supplier.domain.Category;
import by.itech.lab.supplier.dto.CategoryDto;
import by.itech.lab.supplier.dto.mapper.CategoryMapper;
import by.itech.lab.supplier.exception.NotFoundInDBException;
import by.itech.lab.supplier.repository.CategoryRepository;
import by.itech.lab.supplier.service.CategoryService;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.Optional;

@Service
@AllArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    private final CategoryMapper categoryMapper;

    public CategoryDto findByCategory(final String categoryName) {
        return categoryRepository.findByCategory(categoryName)
          .map(categoryMapper::map).orElseThrow(NotFoundInDBException::new);
    }

    public CategoryDto save(final CategoryDto dto) {
        Category category = Optional.ofNullable(dto.getId())
          .map(item -> {
              final Category existing = categoryRepository
                .findById(dto.getId())
                .orElseThrow();
              categoryMapper.update(dto, existing);
              return existing;
          })
          .orElseGet(() -> categoryMapper.map(dto));

        final Category saved = categoryRepository.save(category);
        return categoryMapper.map(saved);
    }

    public Page<CategoryDto> readAll(final Pageable pageable) {
        return categoryRepository.findAll(pageable).map(categoryMapper::map);
    }

    public CategoryDto findById(final Long id) {
        return categoryRepository.findById(id).map(categoryMapper::map)
          .orElseThrow(NotFoundInDBException::new);
    }

    @Transactional
    public void delete(final Long id) {
        categoryRepository.delete(id);
    }

    @Transactional
    public void activate(final Long id) {
        categoryRepository.activate(id);
    }

}

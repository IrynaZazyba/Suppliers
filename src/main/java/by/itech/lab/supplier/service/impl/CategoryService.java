package by.itech.lab.supplier.service.impl;

import by.itech.lab.supplier.domain.Category;
import by.itech.lab.supplier.dto.CategoryDto;
import by.itech.lab.supplier.dto.mapper.CategoryMapper;
import by.itech.lab.supplier.exception.NotFoundInDBException;
import by.itech.lab.supplier.repository.CategoryRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class CategoryService {

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

    public List<CategoryDto> readAll() {
        return categoryRepository.findAll().stream()
          .map(categoryMapper::map).collect(Collectors.toList());
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

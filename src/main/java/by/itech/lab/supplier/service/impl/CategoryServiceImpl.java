package by.itech.lab.supplier.service.impl;

import by.itech.lab.supplier.domain.Category;
import by.itech.lab.supplier.dto.CategoryDto;
import by.itech.lab.supplier.dto.mapper.CategoryMapper;
import by.itech.lab.supplier.exception.ResourceNotFoundException;
import by.itech.lab.supplier.repository.CategoryRepository;
import by.itech.lab.supplier.service.CategoryService;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    private final CategoryMapper categoryMapper;

    public List<CategoryDto> findByCategory(final String categoryName) {
        return categoryRepository.findByCategoryStartingWith(categoryName).stream()
          .map(categoryMapper::map).collect(Collectors.toList());
    }

    @Override
    public Page<CategoryDto> findAll(final Pageable pageable) {
        return categoryRepository.findAll(pageable)
          .map(categoryMapper::map);
    }

    @Override
    @Transactional
    public CategoryDto save(final CategoryDto dto) {
        Category category = Optional.ofNullable(dto.getId())
          .map(item -> {
              final Category existing = categoryRepository
                .findById(dto.getId())
                .orElseThrow();
              categoryMapper.map(dto, existing);
              return existing;
          })
          .orElseGet(() -> categoryMapper.map(dto));

        final Category saved = categoryRepository.save(category);
        return categoryMapper.map(saved);
    }

    public CategoryDto findById(final Long id) {
        return categoryRepository.findById(id).map(categoryMapper::map)
          .orElseThrow(() -> new ResourceNotFoundException("Category with id=" + id + " doesn't exist"));
    }

    @Override
    @Transactional
    public void delete(final Long id) {
        categoryRepository.deleteById(id, LocalDate.now());
    }

}

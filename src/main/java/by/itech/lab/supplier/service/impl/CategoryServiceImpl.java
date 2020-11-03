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
import java.time.LocalDate;
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

    @Override
    public Page<CategoryDto> findAllNotDeleted(final Pageable pageable) {
        return categoryRepository.findAllNotDeleted(pageable)
          .map(categoryMapper::map);
    }

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
          .orElseThrow(NotFoundInDBException::new);
    }

    @Override
    @Transactional
    public void delete(final Long id) {
        categoryRepository.deleteById(id, LocalDate.now());
    }

}

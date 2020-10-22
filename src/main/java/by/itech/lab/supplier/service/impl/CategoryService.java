package by.itech.lab.supplier.service.impl;

import by.itech.lab.supplier.domain.Category;
import by.itech.lab.supplier.dto.CategoryDto;
import by.itech.lab.supplier.dto.mapper.CategoryMapper;
import by.itech.lab.supplier.repository.CategoryRepository;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;

    private final CategoryMapper mapper;

    public CategoryService(final CategoryRepository categoryRepository,
                           final CategoryMapper mapper) {
        this.categoryRepository = categoryRepository;
        this.mapper = mapper;
    }

    public CategoryDto findByCategory(final String categoryName) {
        return categoryRepository.findByCategory(categoryName)
          .map(mapper::map).orElse(null);
    }

    public CategoryDto save(final CategoryDto dto) {
        Category category;
        if (Objects.isNull(dto.getId())) {
            category = mapper.map(dto);
        } else {
            category = mapper.mapCategoryWithId(dto);
        }
        return mapper.map(categoryRepository.save(category));
    }

    public List<CategoryDto> readAll() {
        return categoryRepository.findAll().stream()
          .map(mapper::map).collect(Collectors.toList());
    }

    public CategoryDto findById(final Long id) {
        return categoryRepository.findById(id).map(mapper::map)
          .orElse(null);
    }

    @Transactional
    public void delete(final CategoryDto dto) {
        categoryRepository.delete(dto.getId());
    }

    @Transactional
    public void activate(final CategoryDto dto) {
        categoryRepository.activate(dto.getId());
    }

    public void deleteForever(final CategoryDto dto) {
        categoryRepository.delete(mapper.mapCategoryWithId(dto));
    }

}

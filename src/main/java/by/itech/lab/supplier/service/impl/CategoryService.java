package by.itech.lab.supplier.service.impl;

import by.itech.lab.supplier.domain.Category;
import by.itech.lab.supplier.dto.CategoryDto;
import by.itech.lab.supplier.dto.mapper.CategoryMapper;
import by.itech.lab.supplier.exception.NotUniqueException;
import by.itech.lab.supplier.repository.CategoryRepository;
import org.hibernate.PropertyValueException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

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
        Optional<Category> optionalCategory
          = categoryRepository.findByCategory(categoryName);
        return checkOptional(optionalCategory);
    }

    public CategoryDto create(final CategoryDto dto) throws NotUniqueException {
        Category category;
        if (dto.getId() == null) {
            category = mapper.map(dto);
        } else {
            category = mapper.mapCategoryWithId(dto);
        }
        CategoryDto created;
        try {
            created = mapper.map(categoryRepository.save(category));
        } catch (PropertyValueException notUnique) {
            throw new NotUniqueException(notUnique);
        }
        return created;
    }

    public List<CategoryDto> readAll() {
        List<Category> categories = categoryRepository.findAll();
        List<CategoryDto> dtos = new ArrayList<>();
        for (Category item: categories
             ) {
            dtos.add(mapper.map(item));
        }
        return dtos;
    }

    public CategoryDto readById(final Long id) {
        Optional<Category> optional = categoryRepository.findById(id);
        return checkOptional(optional);
    }

    public void delete(final CategoryDto dto) {
        categoryRepository.delete(mapper.mapCategoryWithId(dto));
    }

    private CategoryDto checkOptional(final Optional<Category> optional) {
        Category category;
        if (optional.isPresent()) {
            category = optional.get();
        } else {
            return null;
        }
        return mapper.map(category);
    }
}

















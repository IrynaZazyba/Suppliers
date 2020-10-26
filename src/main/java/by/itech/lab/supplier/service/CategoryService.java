package by.itech.lab.supplier.service;

import by.itech.lab.supplier.dto.CategoryDto;

import java.util.List;

public interface CategoryService {

    CategoryDto findByCategory(final String categoryName);

    CategoryDto save(final CategoryDto dto);

    List<CategoryDto> readAll();

    CategoryDto findById(final Long id);

    void delete(final Long id);

    void activate(final Long id);

}

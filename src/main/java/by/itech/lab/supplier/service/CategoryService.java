package by.itech.lab.supplier.service;

import by.itech.lab.supplier.dto.CategoryDto;

import java.util.List;

public interface CategoryService extends BaseSimpleService<CategoryDto> {

    List<CategoryDto> findByCategory(final String categoryName);

}

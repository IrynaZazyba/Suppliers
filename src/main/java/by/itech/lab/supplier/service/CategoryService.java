package by.itech.lab.supplier.service;

import by.itech.lab.supplier.dto.CategoryDto;

public interface CategoryService extends BaseSimpleService<CategoryDto> {

    CategoryDto findByCategory(final String categoryName);

}

package by.itech.lab.supplier.service;

import by.itech.lab.supplier.dto.CategoryDto;

public interface CategoryService extends BaseService<CategoryDto> {

    CategoryDto findByCategory(final String categoryName);

    void activate(final Long id);
}

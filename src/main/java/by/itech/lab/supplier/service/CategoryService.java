package by.itech.lab.supplier.service;

import by.itech.lab.supplier.dto.CategoryDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface CategoryService extends BaseService<CategoryDto> {

    Page<CategoryDto> findAllByActive(final Pageable pageable, final Boolean active);

    CategoryDto findByCategory(final String categoryName);

    void activate(final Long id);
}

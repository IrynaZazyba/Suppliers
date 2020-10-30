package by.itech.lab.supplier.service;

import by.itech.lab.supplier.dto.CategoryDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface CategoryService extends BaseService<CategoryDto> {

    CategoryDto findByCategory(final String categoryName);

    Page<CategoryDto> findAllByActive(Pageable pageable, Boolean active);

    void deactivate(final Long id);

    void activate(final Long id);

}

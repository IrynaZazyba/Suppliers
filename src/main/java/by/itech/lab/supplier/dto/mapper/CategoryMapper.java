package by.itech.lab.supplier.dto.mapper;

import by.itech.lab.supplier.domain.Category;
import by.itech.lab.supplier.dto.CategoryDto;
import org.springframework.stereotype.Component;

@Component
public class CategoryMapper implements BaseMapper<Category, CategoryDto> {

    @Override
    public Category map(final CategoryDto dto) {
        return fillCategory(dto);
    }

    @Override
    public CategoryDto map(final Category entity) {
        CategoryDto dto = new CategoryDto();
        dto.setId(entity.getId());
        dto.setCategory(entity.getCategory());
        dto.setTaxRate(entity.getTaxRate());
        dto.setItems(entity.getItems());
        return dto;
    }

    public Category mapCategoryWithId(final CategoryDto dto) {
        Category category = fillCategory(dto);
        category.setId(dto.getId());
        return category;
    }

    private Category fillCategory(final CategoryDto dto) {
        Category category = new Category();
        category.setCategory(dto.getCategory());
        category.setTaxRate(dto.getTaxRate());
        category.setItems(dto.getItems());
        return category;
    }
}

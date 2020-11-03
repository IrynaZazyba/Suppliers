package by.itech.lab.supplier.dto.mapper;

import by.itech.lab.supplier.domain.Category;
import by.itech.lab.supplier.dto.CategoryDto;
import org.springframework.stereotype.Component;

@Component
public class CategoryMapper implements BaseMapper<Category, CategoryDto> {

    @Override
    public Category map(final CategoryDto dto) {
        return Category.builder()
          .category(dto.getCategory())
          .taxRate(dto.getTaxRate())
          .deletedAt(dto.getDeletedAt())
          .id(dto.getId())
          .build();
    }

    @Override
    public CategoryDto map(final Category entity) {
        return CategoryDto.builder()
          .id(entity.getId())
          .taxRate(entity.getTaxRate())
          .category(entity.getCategory())
          .deletedAt(entity.getDeletedAt())
          .build();
    }

    public void map(final CategoryDto from, final Category to) {
        to.setCategory(from.getCategory());
        to.setTaxRate(from.getTaxRate());
        to.setDeletedAt(from.getDeletedAt());
    }

}

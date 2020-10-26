package by.itech.lab.supplier;

import by.itech.lab.supplier.dto.CategoryDto;
import by.itech.lab.supplier.service.impl.CategoryServiceImpl;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;


@SpringBootTest
public class CategoryTest {

    @Autowired
    CategoryServiceImpl service;

    @Test
    void checkAddingCategory() {
        // given
        CategoryDto categoryToAct = fillCategory("Test",
          new BigDecimal(20.0), true);
        List<CategoryDto> categoriesAfterActions;

        // when
        categoriesAfterActions = actionsWithCategory(categoryToAct,
          "Test");

        //then
        assertEquals(categoryToAct, categoriesAfterActions.get(0));
        assertEquals(categoryToAct, categoriesAfterActions.get(1));
        assertFalse(categoriesAfterActions.get(2).isActive());
        assertTrue(categoriesAfterActions.get(3).isActive());
    }

    private List<CategoryDto> actionsWithCategory(
      final CategoryDto categoryDto,
      final String categoryName) {
        List<CategoryDto> results = new ArrayList<>();
        results.add(0, service.save(categoryDto));
        Long id = results.get(0).getId();
        categoryDto.setId(id);
        results.add(1, service.findByCategory(categoryName));
        service.delete(results.get(1).getId());
        results.add(2, service.findByCategory(categoryName));
        service.activate(results.get(2).getId());
        results.add(3, service.findById(id));
        return results;
    }

    @Test
    void checkReadingCategoryByName() {

    }

    private CategoryDto fillCategory(final String category,
                                     final BigDecimal taxRate,
                                     final boolean active) {
        return CategoryDto.builder()
          .category(category)
          .taxRate(taxRate)
          .active(active)
          .build();
    }


}

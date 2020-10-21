package by.itech.lab.supplier;

import by.itech.lab.supplier.domain.Category;
import by.itech.lab.supplier.dto.CategoryDto;
import by.itech.lab.supplier.service.impl.CategoryService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class CategoryTest {

    @Autowired
    CategoryService service;

    @Test
    void checkConnection() {
        CategoryDto category = new CategoryDto();
        category.setCategory("Test");
        category.setTaxRate(20.0);
        category.setActive(true);
        category = service.save(category);
        CategoryDto readCategory = service.findByCategory("Test");
        assert category.equals(readCategory);
        service.delete(category);
        readCategory = service.findByCategory("Test");
        assert !readCategory.isActive();
        readCategory = service.findById(readCategory.getId());
        service.activate(category);
        readCategory = service.findById(readCategory.getId());
        assert readCategory.isActive();
        assert service.readAll().contains(readCategory);
        service.deleteForever(readCategory);
    }
}
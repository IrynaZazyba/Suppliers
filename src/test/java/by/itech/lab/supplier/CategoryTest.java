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
        CategoryDto category1 = new CategoryDto();
        category.setCategory("Test");
        category.setTaxRate(20.0);
        service.create(category);
        service.create(category1);
        System.out.println(service.readAll());
    }
}

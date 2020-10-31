package by.itech.lab.supplier.service;

import by.itech.lab.supplier.domain.Category;
import by.itech.lab.supplier.dto.CategoryDto;
import by.itech.lab.supplier.dto.mapper.CategoryMapper;
import by.itech.lab.supplier.exception.NotFoundInDBException;
import by.itech.lab.supplier.repository.CategoryRepository;
import by.itech.lab.supplier.service.impl.CategoryServiceImpl;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Bean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@ExtendWith(SpringExtension.class)
public class CategoryServiceTest {

    @Autowired
    private CategoryService categoryService;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private CategoryMapper categoryMapper;
    private Category category;
    private Category falseCategory;
    private CategoryDto categoryDto;
    private CategoryDto falseCategoryDto;
    private PageRequest pageRequest;

    @BeforeEach
    void initializeFields() {
        category = Category.builder()
          .id(17L)
          .taxRate(new BigDecimal(20.0))
          .category("Test")
          .active(true)
          .build();
        categoryDto = CategoryDto.builder()
          .id(17L)
          .taxRate(new BigDecimal(20.0))
          .category("Test")
          .active(true)
          .build();
        falseCategory = Category.builder()
          .id(27L)
          .taxRate(new BigDecimal(20.0))
          .category("Test")
          .active(false)
          .build();
        falseCategoryDto = CategoryDto.builder()
          .id(27L)
          .taxRate(new BigDecimal(20.0))
          .category("Test")
          .active(false)
          .build();
        pageRequest = PageRequest.of(0, 10);
    }

    @TestConfiguration
    static class Config {

        @MockBean
        private CategoryRepository categoryRepository;

        @MockBean
        private CategoryMapper categoryMapper;

        @Bean
        public CategoryService categoryService() {
            return new CategoryServiceImpl(categoryRepository, categoryMapper);
        }

    }


    @Test
    public void getAllCategoriesTest() {
        List<Category> categoryList = Collections.singletonList(category);
        List<CategoryDto> categoryDtoList = Collections.singletonList(categoryDto);
        Page<CategoryDto> categoryDtoPage = new PageImpl<>(categoryDtoList);
        Page<Category> categoryPage = new PageImpl<>(categoryList);

        Mockito.when(categoryRepository.findAllByActive(pageRequest, null)).thenReturn(categoryPage);
        Mockito.when(categoryMapper.map(category)).thenReturn(categoryDto);

        Assertions.assertEquals(categoryDtoPage, categoryService.findAllByActive(pageRequest, null));

    }

    @Test
    void getAllCategoriesByActiveTrueTest() {
        List<Category> categoryList = Collections.singletonList(category);
        List<CategoryDto> categoryDtoList = Collections.singletonList(categoryDto);
        Page<CategoryDto> categoryDtoPage = new PageImpl<>(categoryDtoList);
        Page<Category> categoryPage = new PageImpl<>(categoryList);

        Mockito.when(categoryRepository.findAllByActive(pageRequest, true)).thenReturn(categoryPage);
        Mockito.when(categoryMapper.map(category)).thenReturn(categoryDto);

        Assertions.assertEquals(categoryDtoPage, categoryService.findAllByActive(pageRequest, true));
    }

    @Test
    void getAllCategoriesByActiveFalseTest() {
        List<Category> categoryList = Collections.singletonList(falseCategory);
        List<CategoryDto> categoryDtoList = Collections.singletonList(falseCategoryDto);
        Page<CategoryDto> categoryDtoPage = new PageImpl<>(categoryDtoList);
        Page<Category> categoryPage = new PageImpl<>(categoryList);

        Mockito.when(categoryRepository.findAllByActive(pageRequest, false)).thenReturn(categoryPage);
        Mockito.when(categoryMapper.map(falseCategory)).thenReturn(falseCategoryDto);

        Assertions.assertEquals(categoryDtoPage, categoryService.findAllByActive(pageRequest, false));
    }

    @Test
    void getCategoryByIdTest_Positive() {
        Mockito.when(categoryRepository.findById(17L)).thenReturn(Optional.of(category));
        Mockito.when(categoryMapper.map(category)).thenReturn(categoryDto);

        Assertions.assertEquals(categoryDto, categoryService.findById(17L));
    }

    @Test
    void getCategoryByIdTest_Negative() {
        Mockito.when(categoryRepository.findById(17L)).thenReturn(Optional.empty());
        Mockito.when(categoryMapper.map(category)).thenReturn(categoryDto);

        Assertions.assertThrows(NotFoundInDBException.class, () -> categoryService.findById(17L));
    }

    @Test
    void getCategoryByCategoryNameTest_Positive() {
        Mockito.when(categoryRepository.findByCategory("Test")).thenReturn(Optional.of(category));
        Mockito.when(categoryMapper.map(category)).thenReturn(categoryDto);

        Assertions.assertEquals(categoryDto, categoryService.findByCategory("Test"));
    }

    @Test
    void getCategoryByCategoryNameTest_Negative() {
        Mockito.when(categoryRepository.findByCategory("Test")).thenReturn(Optional.empty());
        Mockito.when(categoryMapper.map(category)).thenReturn(categoryDto);

        Assertions.assertThrows(NotFoundInDBException.class, () -> categoryService.findByCategory("Test"));
    }

}

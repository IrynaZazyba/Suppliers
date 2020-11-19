package by.itech.lab.supplier.service;

import by.itech.lab.supplier.domain.Category;
import by.itech.lab.supplier.domain.Item;
import by.itech.lab.supplier.dto.CategoryDto;
import by.itech.lab.supplier.dto.ItemDto;
import by.itech.lab.supplier.dto.mapper.ItemMapper;
import by.itech.lab.supplier.exception.ResourceNotFoundException;
import by.itech.lab.supplier.repository.ItemRepository;
import by.itech.lab.supplier.service.impl.ItemServiceImpl;
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
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@ExtendWith(SpringExtension.class)
public class ItemServiceTest {
    @Autowired
    private ItemService itemService;

    @Autowired
    private ItemRepository itemRepository;

    @Autowired
    private CategoryService categoryService;

    @Autowired
    private ItemMapper itemMapper;

    private Category category;
    private CategoryDto categoryDto;
    private Item item;
    private ItemDto itemDto;
    private PageRequest pageRequest;

    @BeforeEach
    void initializeFields() {
        category = Category.builder()
          .id(17L)
          .category("Fruit")
          .build();
        categoryDto = CategoryDto.builder()
          .id(17L)
          .category("Fruit")
          .build();
        item = Item.builder()
          .id(10L)
          .label("Apple")
          .units(5.0)
          .upc("1234567")
          .deletedAt(LocalDate.now())
          .category(category)
          .build();
        itemDto = ItemDto.builder()
          .id(10L)
          .label("Apple")
          .units(5.0)
          .upc("12345678")
          .deletedAt(LocalDate.now())
          .categoryDto(categoryDto)
          .build();
        pageRequest = PageRequest.of(0, 10);
    }

    @Test
    public void getAllCategoriesTest() {
        List<Item> itemList = Collections.singletonList(item);
        List<ItemDto> itemDtoList = Collections.singletonList(itemDto);
        Page<ItemDto> itemDtoPage = new PageImpl<>(itemDtoList);
        Page<Item> itemPage = new PageImpl<>(itemList);

        Mockito.when(itemRepository.findAll(pageRequest)).thenReturn(itemPage);
        Mockito.when(itemMapper.map(item)).thenReturn(itemDto);

        Assertions.assertEquals(itemDtoPage, itemService.findAll(pageRequest));

    }

    @Test
    void getCategoryByIdTest_Positive() {
        Mockito.when(itemRepository.findById(10L)).thenReturn(Optional.of(item));
        Mockito.when(itemMapper.map(item)).thenReturn(itemDto);

        Assertions.assertEquals(itemDto, itemService.findById(10L));
    }

    @Test
    void getCategoryByIdTest_Negative() {
        Mockito.when(itemRepository.findById(10L)).thenReturn(Optional.empty());
        Mockito.when(itemMapper.map(item)).thenReturn(itemDto);

        Assertions.assertThrows(ResourceNotFoundException.class, () -> itemService.findById(10L));
    }

    @Test
    void getItemByCategoryTest_Positive() {
        List<Item> itemList = Collections.singletonList(item);
        List<ItemDto> itemDtoList = Collections.singletonList(itemDto);
        Page<ItemDto> itemDtoPage = new PageImpl<>(itemDtoList);
        Page<Item> itemPage = new PageImpl<>(itemList);

        Mockito.when(itemRepository.findAllByCategory(categoryDto.getId(), pageRequest)).thenReturn(itemPage);
        Mockito.when(itemMapper.map(item)).thenReturn(itemDto);
        Mockito.when(categoryService.findByCategory("Fruit")).thenReturn(categoryDto);
        Page<ItemDto> found = itemService.findAllByCategory("Fruit", pageRequest);
        Assertions.assertEquals(itemDtoPage, found);
    }

    @Test
    void getItemByCategoryTest_Negative() {
        Mockito.when(itemRepository.findAllByCategory(categoryDto.getId(), pageRequest)).thenReturn(Page.empty());
        Mockito.when(itemMapper.map(item)).thenReturn(itemDto);
        Mockito.when(categoryService.findByCategory("Fruit")).thenReturn(categoryDto);

        Assertions.assertEquals(new PageImpl<ItemDto>(new ArrayList<>()),
          itemService.findAllByCategory("Fruit", pageRequest));
    }

    @TestConfiguration
    static class Config {

        @MockBean
        private ItemRepository itemRepository;

        @MockBean
        private ItemMapper itemMapper;

        @MockBean
        private CategoryService categoryService;

        @Bean
        public ItemService itemService() {
            return new ItemServiceImpl(itemRepository, itemMapper, categoryService);
        }

    }
}

package by.itech.lab.supplier.controller;

import by.itech.lab.supplier.constant.ApiConstants;
import by.itech.lab.supplier.dto.CategoryDto;
import by.itech.lab.supplier.service.CategoryService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;

@RestController
@AllArgsConstructor
@Slf4j
@RequestMapping(ApiConstants.URL_CATEGORY)
public class CategoryController {

    private final CategoryService categoryService;

    @PostMapping
    public CategoryDto save(@Valid @RequestBody CategoryDto categoryDto) {
        return categoryService.save(categoryDto);
    }

    @GetMapping
    public Page<CategoryDto> getAllNotDeleted(Pageable pageable) {
        return categoryService.findAll(pageable);
    }

    @GetMapping(ApiConstants.URL_ID + ApiConstants.URL_ID_PARAMETER)
    public CategoryDto getById(@PathVariable Long id) {
        return categoryService.findById(id);
    }

    @GetMapping(ApiConstants.URL_CATEGORY + ApiConstants.URL_CATEGORY_PARAMETER)
    public CategoryDto getByName(@PathVariable String category) {
        return categoryService.findByCategory(category);
    }

    @DeleteMapping(ApiConstants.URL_ID_PARAMETER)
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        categoryService.delete(id);
    }

}

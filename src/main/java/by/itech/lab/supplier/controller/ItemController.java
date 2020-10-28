package by.itech.lab.supplier.controller;

import by.itech.lab.supplier.constant.ApiConstants;
import by.itech.lab.supplier.dto.CategoryDto;
import by.itech.lab.supplier.dto.ItemDto;
import by.itech.lab.supplier.service.CategoryService;
import by.itech.lab.supplier.service.ItemService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;

import static by.itech.lab.supplier.constant.ApiConstants.URL_ITEM;

@RestController
@AllArgsConstructor
@Slf4j
@RequestMapping(URL_ITEM)
public class ItemController {

    private final ItemService itemService;

    @PostMapping
    public ItemDto save(@Valid @RequestBody ItemDto itemDto) {
        return itemService.save(itemDto);
    }

    @GetMapping(ApiConstants.URL_ACTIVE_PARAMETER)
    public Page<ItemDto> getAllByActive(@PathVariable Boolean active,
                                        @PageableDefault() Pageable pageable) {
        return itemService.findAllByActive(pageable, active);
    }

    @GetMapping(ApiConstants.URL_CATEGORY_PARAMETER)
    public Page<ItemDto> getAll(@PathVariable String category, @PageableDefault() Pageable pageable) {
        return itemService.findAllByCategory(category, pageable);
    }

    @GetMapping(ApiConstants.URL_ID_PARAMETER)
    public ItemDto getById(@PathVariable Long id) {
        return itemService.findById(id);
    }

    @GetMapping(ApiConstants.URL_LABEL_PARAMETER)
    public ItemDto getByName(@PathVariable String label) {
        return itemService.findByLabel(label);
    }

    @PutMapping(ApiConstants.URL_ID_PARAMETER)
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void activate(@PathVariable Long id) {
        itemService.activate(id);
    }

    @DeleteMapping(ApiConstants.URL_ID_PARAMETER)
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        itemService.delete(id);
    }

}

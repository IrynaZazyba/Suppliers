package by.itech.lab.supplier.controller;

import by.itech.lab.supplier.constant.ApiConstants;
import by.itech.lab.supplier.dto.ItemDto;
import by.itech.lab.supplier.service.ItemService;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.util.List;

import static by.itech.lab.supplier.constant.ApiConstants.URL_ITEM;

@RestController
@AllArgsConstructor
@Slf4j
@RequestMapping(ApiConstants.URL_CUSTOMER + ApiConstants.URL_CUSTOMER_ID + URL_ITEM)
public class ItemController {

    private final ItemService itemService;

    @PostMapping
    public ItemDto save(@Valid @RequestBody ItemDto itemDto,
                        @PathVariable Long customerId) {
        itemDto.setCustomerId(customerId);
        return itemService.save(itemDto);
    }

    @GetMapping
    public Page<ItemDto> getAll(Pageable pageable) {
        return itemService.findAll(pageable);
    }

    @GetMapping(ApiConstants.URL_CATEGORY + ApiConstants.URL_CATEGORY_PARAMETER)
    public Page<ItemDto> getAllByCategory(@PathVariable String category, Pageable pageable) {
        return itemService.findAllByCategory(category, pageable);
    }

    @GetMapping(ApiConstants.URL_ID_PARAMETER)
    public ItemDto getById(@PathVariable Long id) {
        return itemService.findById(id);
    }

    @GetMapping(ApiConstants.URL_LABEL + ApiConstants.URL_LABEL_PARAMETER)
    public Page<ItemDto> getByName(@PathVariable String label, Pageable pageable) {
        return itemService.findByLabel(label, pageable);
    }

    @DeleteMapping(ApiConstants.URL_ID_PARAMETER)
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        itemService.delete(id);
    }

    @GetMapping("/upc")
    public List<ItemDto> getItemByUpc(@RequestParam String upc) {
        return itemService.findByUpcContaining(upc.trim());
    }

}

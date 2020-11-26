package by.itech.lab.supplier.controller;

import by.itech.lab.supplier.constant.ApiConstants;
import by.itech.lab.supplier.domain.WarehouseType;
import by.itech.lab.supplier.dto.ApplicationDto;
import by.itech.lab.supplier.dto.WarehouseDto;
import by.itech.lab.supplier.dto.WarehouseItemDto;
import by.itech.lab.supplier.service.WarehouseService;
import lombok.AllArgsConstructor;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.math.BigDecimal;
import java.util.List;

import static by.itech.lab.supplier.constant.ApiConstants.URL_CAPACITY;
import static by.itech.lab.supplier.constant.ApiConstants.URL_CUSTOMER;
import static by.itech.lab.supplier.constant.ApiConstants.URL_CUSTOMER_ID;
import static by.itech.lab.supplier.constant.ApiConstants.URL_ID_PARAMETER;
import static by.itech.lab.supplier.constant.ApiConstants.URL_ITEMS;
import static by.itech.lab.supplier.constant.ApiConstants.URL_RETAILER_ID_PARAMETER;
import static by.itech.lab.supplier.constant.ApiConstants.URL_WAREHOUSE;

@RestController
@AllArgsConstructor
@RequestMapping(URL_CUSTOMER + URL_CUSTOMER_ID + URL_WAREHOUSE)
public class WarehouseController {

    private final WarehouseService warehouseService;

    @GetMapping
    public Page<WarehouseDto> findAll(@PageableDefault final Pageable pageable) {
        return warehouseService.findAll(pageable);
    }

    @GetMapping(URL_ID_PARAMETER)
    public WarehouseDto findById(@PathVariable final Long id) {
        return warehouseService.findById(id);
    }

    @GetMapping(URL_RETAILER_ID_PARAMETER)
    public Page<WarehouseDto> findByRetailerId(@PageableDefault final Pageable pageable,
                                               @PathVariable final Long retailerId) {
        return warehouseService.findByRetailerId(retailerId, pageable);
    }


    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public WarehouseDto save(@Valid @RequestBody final WarehouseDto warehouseDto) {
        return warehouseService.save(warehouseDto);
    }

    @PutMapping(URL_ID_PARAMETER)
    @ResponseStatus(HttpStatus.ACCEPTED)
    public WarehouseDto update(@Valid @RequestBody final WarehouseDto warehouseDto) {
        return warehouseService.save(warehouseDto);
    }

    @DeleteMapping(URL_ID_PARAMETER)
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable final Long id) {
        warehouseService.delete(id);
    }

    @DeleteMapping(URL_RETAILER_ID_PARAMETER)
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteByRetailerId(@PathVariable final Long retailerId) {
        warehouseService.deleteByRetailerId(retailerId);
    }


    @PostMapping(URL_ID_PARAMETER + URL_ITEMS)
    public void acceptItem(@PathVariable Long id, @RequestBody ApplicationDto applicationDto) {
        warehouseService.acceptApplication(applicationDto, id);
    }

    @GetMapping(URL_ID_PARAMETER + URL_CAPACITY)
    public BigDecimal getAvailableCapacity(@PathVariable Long id) {
        return new BigDecimal(warehouseService.getAvailableCapacity(id));
    }

    @GetMapping(ApiConstants.URL_TYPE)
    public List<WarehouseDto> findByType(@RequestParam final WarehouseType type) {
        return warehouseService.findAllByType(type);
    }

    @GetMapping(URL_ID_PARAMETER + URL_ITEMS)
    public List<WarehouseItemDto> getWarehouseItemsByUpc(@PathVariable final Long id,
                                                         @RequestParam final String itemUpc) {
        return warehouseService.getWarehouseItemsByUpc(id, itemUpc);
    }

}

package by.itech.lab.supplier.controller;

import by.itech.lab.supplier.dto.WarehouseDto;
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
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;

import static by.itech.lab.supplier.constant.ApiConstants.*;

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

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public WarehouseDto save(@Valid @RequestBody WarehouseDto warehouseDto) {
        return warehouseService.save(warehouseDto);
    }

    @PutMapping(URL_ID_PARAMETER)
    @ResponseStatus(HttpStatus.ACCEPTED)
    public WarehouseDto updateWarehouse(@Valid @RequestBody WarehouseDto warehouseDto) {
        return warehouseService.update(warehouseDto);
    }

    @DeleteMapping(URL_ID_PARAMETER)
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        warehouseService.delete(id);
    }
}

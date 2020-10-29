package by.itech.lab.supplier.controller;

import by.itech.lab.supplier.dto.WarehouseDto;
import by.itech.lab.supplier.service.WarehouseService;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import static by.itech.lab.supplier.constant.ApiConstants.URL_WAREHOUSE;

@RestController
@AllArgsConstructor
@RequestMapping(URL_WAREHOUSE)
public class WarehouseController {

    private final WarehouseService warehouseService;

    @GetMapping
    public Page<WarehouseDto> getWarehouses(@PageableDefault Pageable pageable) {
        return warehouseService.getWarehouses(pageable);
    }
}

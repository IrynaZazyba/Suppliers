package by.itech.lab.supplier.controller;

import by.itech.lab.supplier.dto.WayBillDto;
import by.itech.lab.supplier.service.WaybillService;
import lombok.AllArgsConstructor;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;

import static by.itech.lab.supplier.constant.ApiConstants.URL_CUSTOMER;
import static by.itech.lab.supplier.constant.ApiConstants.URL_CUSTOMER_ID;
import static by.itech.lab.supplier.constant.ApiConstants.URL_ID_PARAMETER;
import static by.itech.lab.supplier.constant.ApiConstants.URL_WAYBILL;

@RestController
@AllArgsConstructor
@Secured({"ROLE_DISPATCHER", "ROLE_DRIVER", "ROLE_SYSTEM_ADMIN"})
@RequestMapping(URL_CUSTOMER + URL_CUSTOMER_ID + URL_WAYBILL)
public class WaybillController {


    private final WaybillService waybillService;

    @PostMapping
    public WayBillDto createWaybill(@Valid @RequestBody final WayBillDto wayBillDto) {
        return waybillService.save(wayBillDto);
    }

    @PutMapping(URL_ID_PARAMETER)
    public WayBillDto updateWaybill(@Valid @RequestBody final WayBillDto wayBillDto,
                                    @PathVariable final Long id) {
        wayBillDto.setId(id);
        return waybillService.save(wayBillDto);
    }
}

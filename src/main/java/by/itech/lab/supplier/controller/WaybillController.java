package by.itech.lab.supplier.controller;

import by.itech.lab.supplier.domain.WaybillStatus;
import by.itech.lab.supplier.dto.WayBillDto;
import by.itech.lab.supplier.service.WaybillService;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import static by.itech.lab.supplier.constant.ApiConstants.URL_CUSTOMER;
import static by.itech.lab.supplier.constant.ApiConstants.URL_CUSTOMER_ID;
import static by.itech.lab.supplier.constant.ApiConstants.URL_ID_PARAMETER;
import static by.itech.lab.supplier.constant.ApiConstants.URL_WAYBILL;

@RestController
@AllArgsConstructor
@Secured({"ROLE_DRIVER", "ROLE_LOGISTICS_SPECIALIST"})
@RequestMapping(URL_CUSTOMER + URL_CUSTOMER_ID + URL_WAYBILL)
public class WaybillController {

    private final WaybillService waybillService;

    @PostMapping
    public WayBillDto createWaybill(@RequestBody final WayBillDto wayBillDto) {
        System.out.println(wayBillDto.getNumber());
        waybillService.save(wayBillDto);
        return null;
    }

    @PutMapping(URL_ID_PARAMETER)
    public WayBillDto updateWaybill(@RequestBody final WayBillDto wayBillDto,
                                    @PathVariable final Long id) {
        wayBillDto.setId(id);
        return waybillService.save(wayBillDto);
    }

    @GetMapping(URL_ID_PARAMETER)
    public WayBillDto getWaybill(@PathVariable Long id) {
        return waybillService.findById(id);
    }

    @GetMapping
    public Page<WayBillDto> getAllWaybills(
            @PageableDefault(sort = {"id"}, direction = Sort.Direction.DESC) final Pageable pageable,
            @RequestParam(required = false) final WaybillStatus status) {
        return waybillService.findAll(pageable, status);
    }
}

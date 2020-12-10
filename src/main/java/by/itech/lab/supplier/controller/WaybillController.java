package by.itech.lab.supplier.controller;

import by.itech.lab.supplier.domain.WaybillStatus;
import by.itech.lab.supplier.dto.RouteDto;
import by.itech.lab.supplier.dto.WayBillDto;
import by.itech.lab.supplier.dto.WayPointDto;
import by.itech.lab.supplier.dto.validation.CreateDtoValidationGroup;
import by.itech.lab.supplier.dto.validation.UpdateDtoValidationGroup;
import by.itech.lab.supplier.service.RouteService;
import by.itech.lab.supplier.service.WaybillService;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.security.access.annotation.Secured;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.util.List;

import static by.itech.lab.supplier.constant.ApiConstants.URL_CUSTOMER;
import static by.itech.lab.supplier.constant.ApiConstants.URL_CUSTOMER_ID;
import static by.itech.lab.supplier.constant.ApiConstants.URL_DELIVERY;
import static by.itech.lab.supplier.constant.ApiConstants.URL_ID_PARAMETER;
import static by.itech.lab.supplier.constant.ApiConstants.URL_ROUTE;
import static by.itech.lab.supplier.constant.ApiConstants.URL_ROUTE_ID;
import static by.itech.lab.supplier.constant.ApiConstants.URL_WAYBILL;

@RestController
@AllArgsConstructor
@Validated
@Secured({"ROLE_LOGISTICS_SPECIALIST", "ROLE_DRIVER", "ROLE_SYSTEM_ADMIN"})
@RequestMapping(URL_CUSTOMER + URL_CUSTOMER_ID + URL_WAYBILL)
public class WaybillController {

    private final WaybillService waybillService;
    private final RouteService routeService;

    @Validated(CreateDtoValidationGroup.class)
    @PostMapping
    public WayBillDto createWaybill(@Valid @RequestBody final WayBillDto wayBillDto) {
        return waybillService.save(wayBillDto);
    }

    @Validated(UpdateDtoValidationGroup.class)
    @PutMapping(URL_ID_PARAMETER)
    public WayBillDto updateWaybill(@Valid @RequestBody final WayBillDto wayBillDto,
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

    @GetMapping(URL_ROUTE)
    public RouteDto getWaybillRoute(@RequestParam List<Long> waybillAppsId) {
        return routeService.calculateWaybillRoute(waybillAppsId);
    }

    @PutMapping(URL_ID_PARAMETER + URL_DELIVERY)
    public WayBillDto startDelivery(@PathVariable final Long id) {
        return waybillService.startWaybillDelivery(id);
    }

    @PutMapping(URL_ID_PARAMETER + URL_ROUTE + URL_ROUTE_ID)
    public WaybillStatus visitWayPoint(@PathVariable final Long id,
                                       @PathVariable final Long routeId,
                                       @RequestBody final WayPointDto wayPoint) {
        return routeService.makeWayPointVisited(id, routeId, wayPoint);
    }
}

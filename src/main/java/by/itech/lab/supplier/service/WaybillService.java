package by.itech.lab.supplier.service;

import by.itech.lab.supplier.domain.WaybillStatus;
import by.itech.lab.supplier.dto.RouteDto;
import by.itech.lab.supplier.dto.WayBillDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface WaybillService {

    WayBillDto save(WayBillDto wayBillDto);

    WayBillDto findById(Long id);

    Page<WayBillDto> findAll(Pageable pageable, WaybillStatus status);

    RouteDto calculateWaybillRoute(List<Long> appsIds);
}

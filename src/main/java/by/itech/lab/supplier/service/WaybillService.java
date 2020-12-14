package by.itech.lab.supplier.service;

import by.itech.lab.supplier.domain.WaybillStatus;
import by.itech.lab.supplier.dto.RouteDto;
import by.itech.lab.supplier.dto.WayBillDto;
import org.apache.tomcat.jni.Local;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface WaybillService {

    WayBillDto save(WayBillDto wayBillDto);

    Optional<WayBillDto> getWaybillByNumber(String number);

    WayBillDto findById(Long id);

    Page<WayBillDto> findAll(Pageable pageable, WaybillStatus status);

    WayBillDto startWaybillDelivery(Long waybillId);

    WaybillStatus completeWaybillDelivery(Long waybillId);

    @Transactional
    void markWaybillApplicationShipped(Long waybillId, Long addressId);
}

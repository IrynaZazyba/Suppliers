package by.itech.lab.supplier.service;

import by.itech.lab.supplier.dto.WayBillDto;

import java.util.Optional;

public interface WaybillService {

    WayBillDto save(WayBillDto wayBillDto);

    Optional<WayBillDto> getWaybillByNumber(String number);
}

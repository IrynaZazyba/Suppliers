package by.itech.lab.supplier.service;

import by.itech.lab.supplier.dto.TaxDto;

import java.util.List;

public interface TaxService {

    List<TaxDto> getAll();

    TaxDto getTaxByState(Long stateId);
}

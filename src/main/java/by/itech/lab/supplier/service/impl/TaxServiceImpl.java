package by.itech.lab.supplier.service.impl;

import by.itech.lab.supplier.dto.TaxDto;
import by.itech.lab.supplier.dto.mapper.TaxMapper;
import by.itech.lab.supplier.repository.TaxRepository;
import by.itech.lab.supplier.service.TaxService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class TaxServiceImpl implements TaxService {

    private final TaxRepository taxRepository;
    private final TaxMapper taxMapper;

    @Override
    public List<TaxDto> getAll() {
        return taxRepository.findAll().stream().map(taxMapper::map).collect(Collectors.toList());
    }

}

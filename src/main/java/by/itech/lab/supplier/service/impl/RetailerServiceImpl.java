package by.itech.lab.supplier.service.impl;

import by.itech.lab.supplier.domain.Retailer;
import by.itech.lab.supplier.dto.RetailerDto;
import by.itech.lab.supplier.dto.WarehouseDto;
import by.itech.lab.supplier.dto.mapper.RetailerMapper;
import by.itech.lab.supplier.exception.ResourceNotFoundException;
import by.itech.lab.supplier.repository.RetailerRepository;
import by.itech.lab.supplier.service.RetailerService;
import by.itech.lab.supplier.service.WarehouseService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@Slf4j
@AllArgsConstructor
public class RetailerServiceImpl implements RetailerService {
    private final RetailerRepository retailerRepository;

    private final RetailerMapper retailerMapper;

    private final WarehouseService warehouseService;

    @Override
    public RetailerDto findById(Long id) {
        return retailerRepository.findById(id).map(retailerMapper::map)
                .orElseThrow(() -> new ResourceNotFoundException("Retailer with id=" + id + " doesn't exist"));
    }

    @Override
    public Page<RetailerDto> findAll(Pageable pageable) {
        return retailerRepository.findAll(pageable).map(retailerMapper::map);
    }

    @Override
    public Page<RetailerDto> findAllByActive(final Pageable pageable, final Boolean status) {
        return retailerRepository.findByStatus(pageable, status).map(retailerMapper::map);
    }

    @Override
    @Transactional
    public int changeActiveStatusRetailer(Long id, Boolean status) {
        return retailerRepository.updateRetailerStatus(status, id);
    }


    @Transactional
    @Override
    public RetailerDto save(RetailerDto retailerDto) {
        Retailer retailer = Optional.ofNullable(retailerDto.getId())
                .map(item -> {
                    final Retailer existing = retailerRepository
                            .findById(retailerDto.getId())
                            .orElseThrow(() -> new ResourceNotFoundException("User with id=" + retailerDto.getId() + " doesn't exist"));
                    retailerMapper.update(retailerDto, existing);
                    return existing;
                })
                .orElseGet(() -> retailerMapper.map(retailerDto));

        final Retailer saved = retailerRepository.save(retailer);
        final Long retailerId = saved.getId();
        for(WarehouseDto warehouseDto: retailerDto.getWarehouses()){
            warehouseDto.setRetailerId(retailerId);
            warehouseService.save(warehouseDto);
        }
        return retailerMapper.map(saved);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        retailerRepository.delete(id);
    }


}

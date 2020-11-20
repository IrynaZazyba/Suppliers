package by.itech.lab.supplier.service.impl;

import by.itech.lab.supplier.domain.Retailer;
import by.itech.lab.supplier.dto.CustomerDto;
import by.itech.lab.supplier.dto.RetailerDto;
import by.itech.lab.supplier.dto.mapper.RetailerMapper;
import by.itech.lab.supplier.exception.ResourceNotFoundException;
import by.itech.lab.supplier.repository.RetailerRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Optional;

@Service
@Transactional
@Slf4j
@AllArgsConstructor
public class RetailerServiceImpl implements by.itech.lab.supplier.service.RetailerService {
    private final RetailerRepository retailerRepository;

    private final RetailerMapper retailerMapper;

    @Override
    public Optional<RetailerDto> findById(Long id) {
        return Optional.of(retailerRepository.findById(id).map(retailerMapper::map)
                .orElseThrow(() -> new ResourceNotFoundException("Retailer with id=" + id + " doesn't exist")));
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
        return retailerMapper.map(saved);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        retailerRepository.delete(id);
    }


}

package by.itech.lab.supplier.service;

import by.itech.lab.supplier.dto.RetailerDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

public interface RetailerService {
    Optional<RetailerDto> findById(Long id);

    Page<RetailerDto> findAll(Pageable pageable);

    @Transactional
    RetailerDto save(RetailerDto retailerDto);

    @Transactional
    void delete(Long id);
}

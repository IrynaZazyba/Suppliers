package by.itech.lab.supplier.service;

import by.itech.lab.supplier.dto.RetailerDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface RetailerService extends BaseService<RetailerDto> {
    RetailerDto findById(Long id);

    Page<RetailerDto> findAll(Pageable pageable);

    RetailerDto save(RetailerDto retailerDto);

    void delete(Long id);

    int changeActive(Long id, Boolean status);

    Page<RetailerDto> findAllByActive(final Pageable pageable, final Boolean status);
}

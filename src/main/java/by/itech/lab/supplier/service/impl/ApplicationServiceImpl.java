package by.itech.lab.supplier.service.impl;

import by.itech.lab.supplier.dto.ApplicationDto;
import by.itech.lab.supplier.service.ApplicationService;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class ApplicationServiceImpl implements ApplicationService {
    @Override
    public ApplicationDto save(ApplicationDto dto) {
        return null;
    }

    @Override
    public Page<ApplicationDto> findAllByActive(Pageable pageable, Boolean active) {
        return null;
    }

    @Override
    public ApplicationDto findById(Long id) {
        return null;
    }

    @Override
    public void delete(Long id) {

    }

    @Override
    public void activate(Long id) {

    }
}

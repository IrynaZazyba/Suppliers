package by.itech.lab.supplier.service.impl;

import by.itech.lab.supplier.domain.Application;
import by.itech.lab.supplier.domain.ApplicationStatus;
import by.itech.lab.supplier.dto.ApplicationDto;
import by.itech.lab.supplier.dto.mapper.ApplicationMapper;
import by.itech.lab.supplier.exception.NotFoundInDBException;
import by.itech.lab.supplier.repository.ApplicationRepository;
import by.itech.lab.supplier.service.ApplicationService;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.time.LocalDate;
import java.util.Optional;

@Service
@AllArgsConstructor
public class ApplicationServiceImpl implements ApplicationService {

    private final ApplicationRepository applicationRepository;

    private final ApplicationMapper applicationMapper;

    @Override
    public ApplicationDto save(final ApplicationDto dto) {
        Application application = Optional.ofNullable(dto.getId())
          .map(appToSave -> {
              final Application existing = applicationRepository
                .findById(dto.getId())
                .orElseThrow();
              applicationMapper.map(dto, existing);
              return existing;
          })
          .orElseGet(() -> applicationMapper.map(dto));

        final Application saved = applicationRepository.save(application);
        return applicationMapper.map(saved);
    }

    @Override
    public Page<ApplicationDto> findAllNotDeleted(final Pageable pageable) {
        return applicationRepository.findAllNotDeleted(pageable)
          .map(applicationMapper::map);
    }

    @Override
    public ApplicationDto findById(Long id) {
        return applicationRepository.findById(id).map(applicationMapper::map)
          .orElseThrow(NotFoundInDBException::new);
    }

    @Override
    @Transactional
    public void delete(final Long id) {
        applicationRepository.deleteById(id, LocalDate.now());
    }

    @Override
    public Page<ApplicationDto> findAllByCreatedByUsers(final Pageable pageable, final Long userId) {
        return applicationRepository.findAllByCreatedByUsers(pageable, userId)
          .map(applicationMapper::map);
    }

    @Override
    public Page<ApplicationDto> findAllByLocationAddressId(final Pageable pageable, final Long addressId) {
        return applicationRepository.findAllByLocationAddressId(pageable, addressId)
          .map(applicationMapper::map);
    }

    @Override
    public Page<ApplicationDto> findAllByApplicationStatus(final Pageable pageable, final ApplicationStatus status) {
        return applicationRepository.findAllByApplicationStatus(pageable, status.getStatus())
          .map(applicationMapper::map);
    }

    @Override
    public Page<ApplicationDto> findAllByWayBill(final Pageable pageable, final Long waybillId) {
        return applicationRepository.findAllByWayBill(pageable, waybillId)
          .map(applicationMapper::map);
    }

    @Override
    public ApplicationDto findByNumber(final String number) {
        return applicationRepository.findByNumber(number)
          .map(applicationMapper::map).orElseThrow(NotFoundInDBException::new);
    }

    @Override
    @Transactional
    public void changeStatus(final Long appId, final ApplicationStatus applicationStatus) {
        applicationRepository.changeStatus(appId, applicationStatus.getStatus());
    }
}

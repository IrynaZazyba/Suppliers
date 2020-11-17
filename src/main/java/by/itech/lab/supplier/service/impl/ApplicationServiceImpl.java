package by.itech.lab.supplier.service.impl;

import by.itech.lab.supplier.domain.Application;
import by.itech.lab.supplier.domain.ApplicationStatus;
import by.itech.lab.supplier.dto.ApplicationDto;
import by.itech.lab.supplier.dto.ItemsInApplicationDto;
import by.itech.lab.supplier.dto.mapper.ApplicationMapper;
import by.itech.lab.supplier.dto.mapper.ItemsInApplicationMapper;
import by.itech.lab.supplier.exception.ResourceNotFoundException;
import by.itech.lab.supplier.repository.ApplicationRepository;
import by.itech.lab.supplier.repository.ItemInApplicationRepository;
import by.itech.lab.supplier.service.ApplicationService;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class ApplicationServiceImpl implements ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final ApplicationMapper applicationMapper;
    private final ItemInApplicationRepository itemInApplicationRepository;
    private final ItemsInApplicationMapper itemsInApplicationMapper;

    @Override
    @Transactional
    public ApplicationDto save(final ApplicationDto dto) {
        Application application = Optional.ofNullable(dto.getId())
                .map(appToSave -> {
                    final Application existing = applicationRepository
                            .findById(dto.getId())
                            .orElseThrow();
                    applicationMapper.map(dto, existing);
                    return existing;
                })
                .orElseGet(() -> {
                    dto.setRegistrationDate(LocalDate.now());
                    return applicationMapper.map(dto);
                });

        application.setLastUpdated(LocalDate.now());
        application = applicationMapper.mapItems(application);
        final Application saved = applicationRepository.save(application);
        return applicationMapper.map(saved);
    }

    @Override
    public Page<ApplicationDto> findAll(final Pageable pageable) {
        return applicationRepository.findAll(pageable)
                .map(applicationMapper::map);
    }

    @Override
    public ApplicationDto findById(Long id) {
        return applicationRepository.findById(id).map(applicationMapper::map)
                .orElseThrow(() -> new ResourceNotFoundException("Application with id=" + id + " doesn't exist"));
    }

    @Override
    @Transactional
    public void delete(final Long id) {
        applicationRepository.deleteById(id, LocalDate.now());
    }

    @Override
    public Page<ApplicationDto> findAll(Pageable pageable, Boolean roleFlag) {
        return applicationRepository.findAll(pageable, roleFlag)
                .map(applicationMapper::map);
    }

    @Override
    public ApplicationDto findByNumber(final String number) {
        return applicationRepository.findByNumber(number)
                .map(applicationMapper::map)
                .orElseThrow(() -> new ResourceNotFoundException("Application with number=" + number + " doesn't exist"));
    }

    @Override
    @Transactional
    public void changeStatus(final Long appId, final ApplicationStatus applicationStatus) {
        applicationRepository.changeStatus(appId, applicationStatus);
    }

    @Override
    public Double getCapacityItemInApplication(final Set<ItemsInApplicationDto> items) {
        Double capacityApp = 0.0;
        for (ItemsInApplicationDto itemInAppDto : items) {
            capacityApp = capacityApp + (itemInAppDto.getAmount() * itemInAppDto.getItemDto().getUnits());
        }
        return capacityApp;
    }

    @Override
    public boolean isApplicationFullySatisfied(final Long applicationId) {
        return itemInApplicationRepository.getCountUnsatisfiedItems(applicationId) == 0;
    }

    @Override
    public Set<ItemsInApplicationDto> getItemsById(final List<Long> itemsId, final Long applicationId) {
        return itemInApplicationRepository
                .findByApplicationIdAndIdIn(applicationId, itemsId)
                .stream()
                .map(itemsInApplicationMapper::map)
                .collect(Collectors.toSet());
    }

    @Override
    public void setItemInApplicationAcceptedAt(final List<Long> ids) {
       itemInApplicationRepository.setAcceptedAtForItemsInApplication(ids);
    }

}

package by.itech.lab.supplier.service;

import by.itech.lab.supplier.domain.ApplicationStatus;
import by.itech.lab.supplier.dto.ApplicationDto;
import by.itech.lab.supplier.dto.ItemsInApplicationDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Set;

public interface ApplicationService extends BaseSimpleService<ApplicationDto> {

    Page<ApplicationDto> findAll(Pageable pageable, Boolean roleFlag);

    ApplicationDto findByNumber(String number);

    void changeStatus(Long appId, ApplicationStatus applicationStatus);

    Double getCapacityItemInApplication(Set<ItemsInApplicationDto> items);

    boolean isApplicationFullySatisfied(Long applicationId);

    Set<ItemsInApplicationDto> getItemsById(List<Long> itemsId, Long applicationId);

    void setItemInApplicationAcceptedAt(List<Long> ids);
}

package by.itech.lab.supplier.service;

import by.itech.lab.supplier.domain.ApplicationStatus;
import by.itech.lab.supplier.dto.ApplicationDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ApplicationService extends BaseService<ApplicationDto> {

    Page<ApplicationDto> findAll(Pageable pageable, Boolean roleFlag, ApplicationStatus status);

    Page<ApplicationDto> findAll(Pageable pageable, ApplicationStatus status);

    ApplicationDto findByNumber(String number);

    void changeStatus(Long appId, ApplicationStatus applicationStatus);

}

package by.itech.lab.supplier.service;

import by.itech.lab.supplier.domain.ApplicationStatus;
import by.itech.lab.supplier.dto.ApplicationDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ApplicationService extends BaseSimpleService<ApplicationDto> {

    Page<ApplicationDto> findAll(Pageable pageable, Boolean roleFlag);

    ApplicationDto findByNumber(String number);

    void changeStatus(Long appId, ApplicationStatus applicationStatus);

}

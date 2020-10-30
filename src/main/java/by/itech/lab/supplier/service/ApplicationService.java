package by.itech.lab.supplier.service;

import by.itech.lab.supplier.domain.ApplicationStatus;
import by.itech.lab.supplier.dto.ApplicationDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ApplicationService extends BaseService<ApplicationDto> {

    Page<ApplicationDto> findAllByCreatedByUsers(Pageable pageable, Long userId);

    Page<ApplicationDto> findAllByLocationAddressId(Pageable pageable, Long addressId);

    Page<ApplicationDto> findAllByApplicationStatus(Pageable pageable, ApplicationStatus applicationStatus);

    Page<ApplicationDto> findAllByWayBill(Pageable pageable, Long waybillId);

    ApplicationDto findByNumber(String number);

    void changeStatus(Long appId, ApplicationStatus applicationStatus);

}

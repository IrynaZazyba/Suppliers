package by.itech.lab.supplier.service;

import by.itech.lab.supplier.domain.ApplicationStatus;
import by.itech.lab.supplier.dto.ApplicationDto;
import by.itech.lab.supplier.dto.ApplicationItemDto;
import by.itech.lab.supplier.dto.WarehouseDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Set;

public interface ApplicationService extends BaseService<ApplicationDto> {

    Page<ApplicationDto> findAllByRoleAndStatus(Pageable pageable,
                                                Boolean roleFlag,
                                                ApplicationStatus status,
                                                Long userId);

    Page<ApplicationDto> findAllByStatus(Pageable pageable, ApplicationStatus status);

    ApplicationDto findByNumber(String number);

    void changeStatus(Long appId, ApplicationStatus applicationStatus);

    Double getCapacityItemInApplication(Set<ApplicationItemDto> items);

    boolean isApplicationFullySatisfied(Long applicationId);

    Set<ApplicationItemDto> getItemsById(List<Long> itemsId, Long applicationId);

    void setItemInApplicationAcceptedAt(List<Long> ids);

    List<ApplicationDto> getApplicationsByWaybillIds(List<Long> ids);

    List<ApplicationDto> getApplicationsByIds(List<Long> appIds);

    List<ApplicationDto> saveAll(List<ApplicationDto> appsDtos);

    List<WarehouseDto> getWarehousesWithOpenApplications();

    Page<ApplicationDto> getShipmentApplicationsByWarehouseAndStatus(Pageable pageable,
                                                                     Long warehouseId,
                                                                     ApplicationStatus status,
                                                                     Long waybillId);
}

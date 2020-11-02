package by.itech.lab.supplier.controller;

import by.itech.lab.supplier.constant.ApiConstants;
import by.itech.lab.supplier.domain.ApplicationStatus;
import by.itech.lab.supplier.dto.AddressDto;
import by.itech.lab.supplier.dto.ApplicationDto;
import by.itech.lab.supplier.dto.UserDto;
import by.itech.lab.supplier.dto.WayBillDto;
import by.itech.lab.supplier.service.ApplicationService;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;

import static by.itech.lab.supplier.constant.ApiConstants.URL_APPLICATION;

@RestController
@AllArgsConstructor
@RequestMapping(URL_APPLICATION)
public class ApplicationController {

    private final ApplicationService applicationService;

    @PostMapping
    public ApplicationDto save(@Valid @RequestBody ApplicationDto applicationDto) {
        return applicationService.save(applicationDto);
    }

    @PutMapping(ApiConstants.URL_ID_PARAMETER + ApiConstants.URL_STATUS_PARAMETER)
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void changeStatus(@PathVariable Long applicationId,
                             @PathVariable String status) {
        applicationService.changeStatus(applicationId, ApplicationStatus.valueOf(status));
    }

    @GetMapping(ApiConstants.URL_DELETED_PARAMETER)
    public Page<ApplicationDto> getAllByDeleted(@PathVariable Boolean deleted,
                                                Pageable pageable) {
        return applicationService.findAllByDeleted(pageable, deleted);
    }

    @GetMapping(ApiConstants.URL_CREATED_BY_ID_PARAMETER)
    public Page<ApplicationDto> getAllByCreatedByUsers(@PathVariable Long userId,
                                                       Pageable pageable) {
        return applicationService.findAllByCreatedByUsers(pageable, userId);
    }

    @GetMapping(ApiConstants.URL_ADDRESS_ID_PARAMETER)
    public Page<ApplicationDto> getAllByLocationAddress(@PathVariable Long addressId,
                                                        Pageable pageable) {
        return applicationService.findAllByLocationAddressId(pageable, addressId);
    }

    @GetMapping(ApiConstants.URL_WAYBILL_ID_PARAMETER)
    public Page<ApplicationDto> getAllByWaybill(@PathVariable Long waybillId,
                                                       Pageable pageable) {
        return applicationService.findAllByWayBill(pageable, waybillId);
    }

    @GetMapping(ApiConstants.URL_STATUS_PARAMETER)
    public Page<ApplicationDto> getAllByWaybill(@PathVariable String status,
                                                Pageable pageable) {
        return applicationService.findAllByApplicationStatus(pageable, ApplicationStatus.valueOf(status));
    }

    @GetMapping(ApiConstants.URL_ID_PARAMETER)
    public ApplicationDto getById(@PathVariable Long id) {
        return applicationService.findById(id);
    }

    @GetMapping(ApiConstants.URL_NUMBER_PARAMETER)
    public ApplicationDto getByNumber(@PathVariable String number) {
        return applicationService.findByNumber(number);
    }

    @DeleteMapping(ApiConstants.URL_ID_PARAMETER)
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        applicationService.delete(id);
    }


}

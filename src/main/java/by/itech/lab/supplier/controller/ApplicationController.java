package by.itech.lab.supplier.controller;

import by.itech.lab.supplier.auth.domain.UserImpl;
import by.itech.lab.supplier.constant.ApiConstants;
import by.itech.lab.supplier.domain.ApplicationStatus;
import by.itech.lab.supplier.domain.Role;
import by.itech.lab.supplier.dto.ApplicationDto;
import by.itech.lab.supplier.dto.validation.CreateDtoValidationGroup;
import by.itech.lab.supplier.dto.validation.UpdateDtoValidationGroup;
import by.itech.lab.supplier.service.ApplicationService;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.util.Objects;

import static by.itech.lab.supplier.constant.ApiConstants.URL_APPLICATION;
import static by.itech.lab.supplier.constant.ApiConstants.URL_ID_PARAMETER;
import static by.itech.lab.supplier.constant.ApiConstants.URL_WAREHOUSE;

@Validated
@RestController
@AllArgsConstructor
@RequestMapping(ApiConstants.URL_CUSTOMER + ApiConstants.URL_CUSTOMER_ID + URL_APPLICATION)
public class ApplicationController {

    private final ApplicationService applicationService;

    @Validated(CreateDtoValidationGroup.class)
    @PostMapping
    @Secured({"ROLE_DISPATCHER", "ROLE_LOGISTICS_SPECIALIST", "ROLE_SYSTEM_ADMIN"})
    public ApplicationDto save(@Valid @RequestBody ApplicationDto applicationDto) {
        return applicationService.save(applicationDto);
    }

    @Validated(UpdateDtoValidationGroup.class)
    @PutMapping(URL_ID_PARAMETER)
    @Secured({"ROLE_DISPATCHER", "ROLE_LOGISTICS_SPECIALIST", "ROLE_SYSTEM_ADMIN"})
    public ApplicationDto update(@PathVariable final Long id, @Valid @RequestBody final ApplicationDto applicationDto) {
        applicationDto.setId(id);
        return applicationService.save(applicationDto);
    }

    @PutMapping(ApiConstants.URL_ID_PARAMETER + ApiConstants.URL_STATUS_PARAMETER)
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Secured({"ROLE_DISPATCHER", "ROLE_LOGISTICS_SPECIALIST", "ROLE_SYSTEM_ADMIN"})
    public void changeStatus(@PathVariable Long id,
                             @PathVariable String status) {
        applicationService.changeStatus(id, ApplicationStatus.valueOf(status));
    }

    @GetMapping
    @Secured({"ROLE_DISPATCHER", "ROLE_LOGISTICS_SPECIALIST"})
    public Page<ApplicationDto> getAllByStatus(
            @PageableDefault(sort = {"id"}, direction = Sort.Direction.DESC) final Pageable pageable,
            @RequestParam(required = false) final ApplicationStatus status,
            @RequestParam(required = false) final Boolean isAll) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Boolean roleFlag = null;
        Long userId = null;
        if (authentication.getPrincipal() instanceof UserImpl) {
            UserImpl user = (UserImpl) authentication.getPrincipal();
            roleFlag = user.getAuthorities().contains(Role.ROLE_DISPATCHER);
            userId = Objects.nonNull(isAll) && !isAll ? user.getId() : null;
        }
        return applicationService.findAllByRoleAndStatus(pageable, roleFlag, status, userId);
    }

    @GetMapping(ApiConstants.URL_ADMIN)
    @Secured("ROLE_SYSTEM_ADMIN")
    public Page<ApplicationDto> getAllAdminByStatus(@PageableDefault final Pageable pageable,
                                                    @RequestParam(required = false) final ApplicationStatus status) {
        return applicationService.findAllByStatus(pageable, status);
    }

    @GetMapping(ApiConstants.URL_ID_PARAMETER)
    @Secured({"ROLE_DISPATCHER", "ROLE_LOGISTICS_SPECIALIST", "ROLE_SYSTEM_ADMIN"})
    public ApplicationDto getById(@PathVariable Long id) {
        return applicationService.findById(id);
    }

    @GetMapping(ApiConstants.URL_NUMBER + ApiConstants.URL_NUMBER_PARAMETER)
    @Secured({"ROLE_DISPATCHER", "ROLE_LOGISTICS_SPECIALIST", "ROLE_SYSTEM_ADMIN"})
    public ApplicationDto getByNumber(@PathVariable String number) {
        return applicationService.findByNumber(number);
    }

    @DeleteMapping(ApiConstants.URL_ID_PARAMETER)
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Secured({"ROLE_DISPATCHER", "ROLE_LOGISTICS_SPECIALIST", "ROLE_SYSTEM_ADMIN"})
    public void delete(@PathVariable Long id) {
        applicationService.delete(id);
    }

    @GetMapping(URL_WAREHOUSE)
    public Page<ApplicationDto> getShipmentApplicationByWarehouseAndStatus(
            @PageableDefault(sort = {"wayBill"}, direction = Sort.Direction.DESC) final Pageable pageable,
            @RequestParam final Long warehouseId,
            @RequestParam final ApplicationStatus applicationStatus,
            @RequestParam(required = false) final Long waybillId) {
        return applicationService
                .getShipmentApplicationsByWarehouseAndStatus(pageable, warehouseId, applicationStatus, waybillId);
    }

}

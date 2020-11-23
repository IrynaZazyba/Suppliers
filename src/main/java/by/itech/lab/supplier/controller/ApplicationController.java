package by.itech.lab.supplier.controller;

import by.itech.lab.supplier.auth.domain.UserImpl;
import by.itech.lab.supplier.constant.ApiConstants;
import by.itech.lab.supplier.domain.ApplicationStatus;
import by.itech.lab.supplier.domain.Role;
import by.itech.lab.supplier.dto.ApplicationDto;
import by.itech.lab.supplier.service.ApplicationService;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
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
@RequestMapping(ApiConstants.URL_CUSTOMER + ApiConstants.URL_CUSTOMER_ID + URL_APPLICATION)
public class ApplicationController {

    private final ApplicationService applicationService;

    @PostMapping
    @Secured({"ROLE_DISPATCHER", "ROLE_LOGISTICS_SPECIALIST", "ROLE_SYSTEM_ADMIN"})
    public ApplicationDto save(@Valid @RequestBody ApplicationDto applicationDto) {
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
    @Secured({"ROLE_DISPATCHER", "ROLE_LOGISTICS_SPECIALIST", "ROLE_SYSTEM_ADMIN"})
    public Page<ApplicationDto> getAll(final Pageable pageable) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Boolean roleFlag = null;
        if (authentication.getPrincipal() instanceof UserImpl) {
            UserImpl user = (UserImpl) authentication.getPrincipal();
            roleFlag = user.getAuthorities().contains(Role.ROLE_DISPATCHER);
        }
        return applicationService.findAll(pageable, roleFlag);
    }

    @GetMapping(ApiConstants.URL_ADMIN)
    @Secured("ROLE_SYSTEM_ADMIN")
    public Page<ApplicationDto> getAllAdmin(final Pageable pageable) {
        return applicationService.findAll(pageable);
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

}

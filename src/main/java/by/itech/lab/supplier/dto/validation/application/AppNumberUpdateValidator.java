package by.itech.lab.supplier.dto.validation.application;

import by.itech.lab.supplier.dto.ApplicationDto;
import by.itech.lab.supplier.dto.validation.application.constraints.AppNumberUpdateConstraint;
import by.itech.lab.supplier.exception.ResourceNotFoundException;
import by.itech.lab.supplier.service.ApplicationService;
import lombok.RequiredArgsConstructor;

import javax.servlet.http.HttpServletRequest;
import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

@RequiredArgsConstructor
public class AppNumberUpdateValidator implements ConstraintValidator<AppNumberUpdateConstraint, String> {

    private final HttpServletRequest request;
    private final ApplicationService applicationService;

    @Override
    public boolean isValid(String number, ConstraintValidatorContext context) {
        String[] splitted = request.getRequestURI().trim().split("/");
        Long appId = Long.valueOf(splitted[splitted.length - 1]);
        try {
            ApplicationDto appByNumber = applicationService.findByNumber(number);
            return appByNumber.getId().equals(appId);
        } catch (ResourceNotFoundException ex) {
            return true;
        }
    }
}

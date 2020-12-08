package by.itech.lab.supplier.dto.validation.application;

import by.itech.lab.supplier.dto.validation.application.constraints.AppNumberConstraint;
import by.itech.lab.supplier.exception.ResourceNotFoundException;
import by.itech.lab.supplier.service.ApplicationService;
import lombok.RequiredArgsConstructor;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

@RequiredArgsConstructor
public class AppNumberValidator implements ConstraintValidator<AppNumberConstraint, String> {

    private final ApplicationService applicationService;

    @Override
    public boolean isValid(String number, ConstraintValidatorContext cxt) {
        try {
            applicationService.findByNumber(number);
            return false;
        } catch (ResourceNotFoundException ex) {
            return true;
        }
    }
}

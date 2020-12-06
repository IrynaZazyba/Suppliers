package by.itech.lab.supplier.dto.validation.waybill;

import by.itech.lab.supplier.dto.validation.waybill.constraints.WaybillCreateNumberConstraint;
import by.itech.lab.supplier.service.WaybillService;
import lombok.RequiredArgsConstructor;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

@RequiredArgsConstructor
public class CreateWaybillNumberValidator implements ConstraintValidator<WaybillCreateNumberConstraint, String> {

    private final WaybillService waybillService;

    @Override
    public boolean isValid(String number, ConstraintValidatorContext cxt) {
        return waybillService.getWaybillByNumber(number).isEmpty();
    }

}

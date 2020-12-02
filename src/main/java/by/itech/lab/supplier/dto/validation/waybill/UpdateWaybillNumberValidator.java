package by.itech.lab.supplier.dto.validation.waybill;

import by.itech.lab.supplier.dto.WayBillDto;
import by.itech.lab.supplier.dto.validation.waybill.constraints.WaybillUpdateNumberConstraint;
import by.itech.lab.supplier.service.WaybillService;
import lombok.RequiredArgsConstructor;

import javax.servlet.http.HttpServletRequest;
import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;
import java.util.Optional;

@RequiredArgsConstructor
public class UpdateWaybillNumberValidator implements ConstraintValidator<WaybillUpdateNumberConstraint, String> {

    private final WaybillService waybillService;
    private final HttpServletRequest request;

    @Override
    public boolean isValid(String number, ConstraintValidatorContext cxt) {
        String[] splitted = request.getRequestURI().trim().split("/");
        Long appId = Long.valueOf(splitted[splitted.length - 1]);
        Optional<WayBillDto> waybillByNumber = waybillService.getWaybillByNumber(number);
        return waybillByNumber.map(wayBillDto -> wayBillDto.getId().equals(appId)).orElse(false);
    }
}

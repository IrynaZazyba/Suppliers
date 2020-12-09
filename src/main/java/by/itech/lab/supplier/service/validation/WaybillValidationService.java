package by.itech.lab.supplier.service.validation;

import by.itech.lab.supplier.domain.WayBill;
import by.itech.lab.supplier.dto.ApplicationDto;
import by.itech.lab.supplier.exception.domain.ValidationErrors;

import java.util.List;

public interface WaybillValidationService {

    ValidationErrors validateWaybill(WayBill wayBill, List<ApplicationDto> applications);

}

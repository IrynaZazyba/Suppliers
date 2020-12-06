package by.itech.lab.supplier.service.validation;

import by.itech.lab.supplier.dto.ApplicationDto;
import by.itech.lab.supplier.dto.WayBillDto;
import by.itech.lab.supplier.exception.domain.ValidationErrors;

import java.util.List;

public interface WaybillValidationService {

    ValidationErrors validateWaybill(WayBillDto wayBillDto, List<ApplicationDto> applications);

}

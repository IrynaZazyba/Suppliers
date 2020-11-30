package by.itech.lab.supplier.service;

import by.itech.lab.supplier.dto.ApplicationDto;
import by.itech.lab.supplier.dto.ApplicationItemDto;

import java.util.Set;

public interface PriceCalculationService {

    Set<ApplicationItemDto> calculateAppItemsPrice(ApplicationDto appDto);
}

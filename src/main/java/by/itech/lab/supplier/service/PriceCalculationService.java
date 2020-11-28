package by.itech.lab.supplier.service;

import by.itech.lab.supplier.domain.Application;
import by.itech.lab.supplier.domain.ApplicationItem;

import java.util.Set;

public interface PriceCalculationService {

    Application calculateAppItemsPrice(Application app);
}

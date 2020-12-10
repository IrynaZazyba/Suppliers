package by.itech.lab.supplier.service;

import by.itech.lab.supplier.domain.Application;
import by.itech.lab.supplier.dto.RouteDto;
import by.itech.lab.supplier.dto.WarehouseDto;

import java.util.List;

public interface CalculationService {

    Application calculateAppItemsPrice(Application app);

    RouteDto calculateOptimalRoute(List<WarehouseDto> warehouseDto, WarehouseDto source);
}

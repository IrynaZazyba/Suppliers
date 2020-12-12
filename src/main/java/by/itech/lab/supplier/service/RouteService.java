package by.itech.lab.supplier.service;

import by.itech.lab.supplier.domain.WaybillStatus;
import by.itech.lab.supplier.dto.RouteDto;
import by.itech.lab.supplier.dto.WayPointDto;

import java.util.List;

public interface RouteService {

    WaybillStatus makeWayPointVisited(Long wayBillId, Long routeId, WayPointDto wayPointId);

    RouteDto calculateWaybillRoute(List<Long> appsIds);
}

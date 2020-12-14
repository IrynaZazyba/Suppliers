package by.itech.lab.supplier.service.impl;

import by.itech.lab.supplier.domain.Route;
import by.itech.lab.supplier.domain.WayPoint;
import by.itech.lab.supplier.domain.WaybillStatus;
import by.itech.lab.supplier.dto.ApplicationDto;
import by.itech.lab.supplier.dto.RouteDto;
import by.itech.lab.supplier.dto.WarehouseDto;
import by.itech.lab.supplier.dto.WayPointDto;
import by.itech.lab.supplier.exception.ConflictWithWayPointTrackingException;
import by.itech.lab.supplier.repository.RouteRepository;
import by.itech.lab.supplier.service.ApplicationService;
import by.itech.lab.supplier.service.CalculationService;
import by.itech.lab.supplier.service.RouteService;
import by.itech.lab.supplier.service.WaybillService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RouteServiceImpl implements RouteService {

    private final RouteRepository routeRepository;
    private final WaybillService waybillService;
    private final ApplicationService applicationService;
    private final CalculationService calculationService;

    @Override
    @Transactional
    public WaybillStatus makeWayPointVisited(final Long wayBillId, final Long routeId, final WayPointDto wayPointDto) {
        final Long wayPointId = wayPointDto.getId();
        final Route route = routeRepository.findById(routeId).orElseThrow(() ->
                new ConflictWithWayPointTrackingException("Attempt to change the route that doesn't exist"));
        final Map<Integer, WayPoint> mappedByPriority = route.getWayPoints().stream()
                .collect(Collectors.toMap(WayPoint::getPriority, Function.identity()));
        final WayPoint wayPoint = route.getWayPoints().stream()
                .filter(wp -> wp.getId().equals(wayPointId))
                .findAny()
                .orElseThrow(() -> new ConflictWithWayPointTrackingException(
                        "No waypoint with id =" + wayPointId + " at the current route"));

        final WayPoint prevPoint = mappedByPriority.get(wayPoint.getPriority() - 1);
        if (prevPoint.getPriority() != 0 && !prevPoint.isVisited()) {
            throw new ConflictWithWayPointTrackingException("The order of the following route points is violated");
        }
        routeRepository.makeWayPointVisited(wayPointId);
        waybillService.markWaybillApplicationShipped(wayBillId, wayPoint.getAddress().getId());
        return checkIsLastPointVisited(wayBillId, route.getWayPoints());
    }

    @Override
    public RouteDto calculateWaybillRoute(final List<Long> appsIds) {
        final List<ApplicationDto> applicationsByIds = applicationService.getApplicationsByIds(appsIds);
        final List<WarehouseDto> warehouses = applicationsByIds
                .stream()
                .map(ApplicationDto::getDestinationLocationDto)
                .collect(Collectors.toList());
        return calculationService.calculateOptimalRoute(warehouses, applicationsByIds.get(0).getSourceLocationDto());
    }

    private WaybillStatus checkIsLastPointVisited(final Long wayBillId, final List<WayPoint> wayPoints) {
        List<WayPoint> notVisited = wayPoints
                .stream()
                .filter(wp -> !wp.isVisited() && wp.getPriority() != 0)
                .collect(Collectors.toList());
        return notVisited.size() == 1 ? waybillService.completeWaybillDelivery(wayBillId) : WaybillStatus.IN_PROGRESS;
    }

}

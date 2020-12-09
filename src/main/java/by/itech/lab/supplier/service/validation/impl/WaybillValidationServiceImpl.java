package by.itech.lab.supplier.service.validation.impl;

import by.itech.lab.supplier.domain.WayBill;
import by.itech.lab.supplier.dto.ApplicationDto;
import by.itech.lab.supplier.dto.CarDto;
import by.itech.lab.supplier.exception.domain.ValidationErrors;
import by.itech.lab.supplier.service.ApplicationService;
import by.itech.lab.supplier.service.CarService;
import by.itech.lab.supplier.service.validation.WaybillValidationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class WaybillValidationServiceImpl implements WaybillValidationService {

    private final ApplicationService applicationService;
    private final CarService carService;

    @Override
    public ValidationErrors validateWaybill(final WayBill wayBill, final List<ApplicationDto> applications) {
        ValidationErrors validationErrors = new ValidationErrors();

        if (!checkCarCapacity(wayBill, applications)) {
            validationErrors.addValidationMessage("The car can't accommodate all the items in the applications");
        }

        if (!checkRoute(applications, wayBill)) {
            validationErrors.addValidationMessage("There is no warehouses with the address specified in the route");
        }
        return validationErrors;
    }


    private boolean checkCarCapacity(final WayBill wayBill, final List<ApplicationDto> applicationDtos) {
        final Long carId = wayBill.getCar().getId();
        final CarDto car = carService.findById(carId);
        final Double currentCarCapacity = car.getCurrentCapacity();

        final Double appsCapacity = applicationDtos.stream()
                .filter(app -> Objects.nonNull(app.getWayBillId()))
                .map(app -> applicationService.getCapacityItemInApplication(app.getItems()))
                .reduce(0.0, Double::sum);
        return currentCarCapacity >= appsCapacity;
    }

    private boolean checkRoute(List<ApplicationDto> appDtos, final WayBill wayBill) {
        List<Long> addressIds = appDtos
                .stream()
                .map(app -> app.getDestinationLocationDto().getAddressDto().getId())
                .collect(Collectors.toList());
        if (addressIds.size() > 0) {
            addressIds.add(appDtos.get(0).getSourceLocationDto().getAddressDto().getId());
        }
        List<Long> idsFromDto = wayBill.getRoute().getWayPoints()
                .stream()
                .map(wp -> wp.getAddress().getId())
                .collect(Collectors.toList());
        return addressIds.containsAll(idsFromDto);
    }

}

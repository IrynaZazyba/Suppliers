package by.itech.lab.supplier.service.impl;

import by.itech.lab.supplier.dto.AddressDto;
import by.itech.lab.supplier.dto.ApplicationDto;
import by.itech.lab.supplier.dto.ApplicationItemDto;
import by.itech.lab.supplier.dto.TaxDto;
import by.itech.lab.supplier.dto.WarehouseDto;
import by.itech.lab.supplier.dto.WarehouseItemDto;
import by.itech.lab.supplier.service.TaxService;
import by.itech.lab.supplier.service.WarehouseService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CalculationService {

    private final WarehouseService warehouseService;
    private final TaxService taxService;

    public static double distFrom(double lat1, double lng1, double lat2, double lng2) {
        double earthRadius = 6371000; //meters
        double dLat = Math.toRadians(lat2 - lat1);
        double dLng = Math.toRadians(lng2 - lng1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) *
                        Math.sin(dLng / 2) * Math.sin(dLng / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return earthRadius * c;
    }

    public Set<ApplicationItemDto> calculatePrice(ApplicationDto appDto) {
        List<Long> collect = appDto.getItems().stream().map(e -> e.getItemDto().getId()).collect(Collectors.toList());

        //mapped WarehouseItem by itemId and cost
        Map<Long, WarehouseItemDto> whItems = warehouseService
                .getWarehouseItemContainingItems(appDto.getSourceLocationDto().getId(), collect).stream()
                .collect(Collectors.toMap(e -> e.getItem().getId(), Function.identity()));

        //mapped taxes by stateId and percentage
        //todo get only one tax by stateId
        Map<Long, Double> taxes = taxService.getAll()
                .stream().collect(Collectors.toMap(t -> t.getStateDto().getId(), TaxDto::getPercentage));
        final Double tax = taxes.get(appDto.getDestinationLocationDto().getId());

        WarehouseDto source = warehouseService.findById(appDto.getSourceLocationDto().getId());
        WarehouseDto dest = warehouseService.findById(appDto.getDestinationLocationDto().getId());
        AddressDto destinationAddress = dest.getAddressDto();
        AddressDto sourceAddress = source.getAddressDto();

        final double distance = distFrom(sourceAddress.getLatitude(), sourceAddress.getLongitude(),
                destinationAddress.getLatitude(), destinationAddress.getLongitude());

        return appDto.getItems().stream().peek(i -> {
            final Long itemId = i.getItemDto().getId();
            WarehouseItemDto whi = whItems.get(itemId);
            BigDecimal taxPerDistance = whi.getItem().getCategoryDto().getTaxRate();
            BigDecimal cost = whi.getCost();
            double price = cost.doubleValue() * (1 + tax / 100) + (taxPerDistance.doubleValue() * distance / 1000);
            i.setCost(new BigDecimal(price));
        }).collect(Collectors.toSet());

    }

}

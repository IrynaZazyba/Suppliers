package by.itech.lab.supplier.service.impl;

import by.itech.lab.supplier.domain.Application;
import by.itech.lab.supplier.domain.ApplicationItem;
import by.itech.lab.supplier.dto.AddressDto;
import by.itech.lab.supplier.dto.WarehouseItemDto;
import by.itech.lab.supplier.exception.ResourceNotFoundException;
import by.itech.lab.supplier.service.PriceCalculationService;
import by.itech.lab.supplier.service.TaxService;
import by.itech.lab.supplier.service.WarehouseService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PriceCalculationServiceImpl implements PriceCalculationService {

    private final static Integer EARTH_RADIUS_IN_METERS = 6371000;

    private final WarehouseService warehouseService;
    private final TaxService taxService;

    private double calculateDistance(final AddressDto source, final AddressDto destination) {
        final double lat1 = source.getLatitude();
        final double lng1 = source.getLongitude();
        final double lat2 = destination.getLatitude();
        final double lng2 = destination.getLongitude();

        final double dLat = Math.toRadians(lat2 - lat1);
        final double dLng = Math.toRadians(lng2 - lng1);
        final double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) *
                        Math.sin(dLng / 2) * Math.sin(dLng / 2);
        final double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return EARTH_RADIUS_IN_METERS * c;
    }

    @Override
    public Application calculateAppItemsPrice(final Application app) {
        final List<Long> itemsIds = app.getItems().stream().map(e -> e.getItem().getId()).collect(Collectors.toList());
        final Long sourceLocationId = app.getSourceLocationAddress().getId();
        final Long destinationLocationId = app.getDestinationLocationAddress().getId();

        //mapped WarehouseItem by itemId
        final Map<Long, WarehouseItemDto> whItems = warehouseService
                .getWarehouseItemContainingItems(sourceLocationId, itemsIds).stream()
                .collect(Collectors.toMap(e -> e.getItem().getId(), Function.identity()));

        final AddressDto destinationAddress = warehouseService.findById(sourceLocationId).getAddressDto();
        final AddressDto sourceAddress = warehouseService.findById(destinationLocationId).getAddressDto();
        final double distance = calculateDistance(sourceAddress, destinationAddress);
        final Double tax = taxService.getTaxByState(destinationAddress.getState().getId()).getPercentage();
        app.getItems().forEach(item -> setItemPrice(item, whItems, distance, tax));
        return app;
    }

    private void setItemPrice(final ApplicationItem appItem,
                              final Map<Long, WarehouseItemDto> whItems,
                              final double distance,
                              final Double tax) {
        final WarehouseItemDto whi = whItems.get(appItem.getItem().getId());
        BigDecimal taxPerDistance = whi.getItem().getCategoryDto().getTaxRate();
        BigDecimal cost = whi.getCost();
        double price = cost.doubleValue() * (1 + tax / 100) + (taxPerDistance.doubleValue() * (distance / 1000));
        appItem.setCost(new BigDecimal(price));
    }

}

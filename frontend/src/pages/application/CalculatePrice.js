import {getDistance} from "geolib";

export default function calculateItemPrice(item, taxes, distance, zoneId) {

    let taxId = taxes.find(t => t.stateDto.id == zoneId);
    let res = item.cost * (1 + taxId.percentage / 100) + (distance * item.category.taxRate);
    return res.toFixed(2);
};


export function recalculateItems(items, taxes, distance, zoneId) {
    return items.map(item => {
        item.price = calculateItemPrice(item, taxes, distance, zoneId);
        return item;
    });
}

export function calculateDistance(warehouses, sourceId, destinationId) {
    let dest = warehouses.destination.find(i => i.id == destinationId);
    let sour = warehouses.source.find(i => i.id == sourceId);
    let distance = getDistance(
        {latitude: dest.addressDto.latitude, longitude: dest.addressDto.longitude},
        {latitude: sour.addressDto.latitude, longitude: sour.addressDto.longitude},
    );
    return distance / 1000;
}


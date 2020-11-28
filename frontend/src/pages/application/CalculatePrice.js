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

export function recalculateItemWhenChangeWarehouse(app, sourceId, destinationId, taxes, whItems, warehouses) {

    let dest = warehouses.destination.find(i => i.id == destinationId);
    let sour = warehouses.source.find(i => i.id == sourceId);

    app.sourceLocationDto = sour;
    app.destinationLocationDto = dest;

    let distance = getDistance(
        {latitude: dest.addressDto.latitude, longitude: dest.addressDto.longitude},
        {latitude: sour.addressDto.latitude, longitude: sour.addressDto.longitude},
    );
    let zoneId = app.destinationLocationDto.addressDto.state.id;
    let taxId = taxes.find(t => t.stateDto.id == zoneId);

    let mapItemInWarehouse = new Map(whItems.map(i => [i.item.id, i]));
    app.items.forEach(ap => {
        let iiw = mapItemInWarehouse.get(ap.itemDto.id);
        if (iiw) {
            ap.cost = (iiw.cost * (1 + taxId.percentage / 100) + (distance / 1000 * iiw.item.categoryDto.taxRate)).toFixed(2);
        }
    });

    return app;
}




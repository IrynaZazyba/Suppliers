export default function validateWaybill(waybill, addedApps, waypoints) {
    let errorsFields = [];

    if (!waybill.number) {
        errorsFields.push("number");
    }

    if (!waybill.sourceLocationWarehouseDto) {
        errorsFields.push("source");
    }

    if (!waybill.driver) {
        errorsFields.push("driver");
    }

    if (!waybill.car) {
        errorsFields.push("car");
    }

    if (addedApps.length === 0) {
        errorsFields.push("apps");
    }

    if (waypoints.length === 0) {
        errorsFields.push("introduce-route");
    }

    return errorsFields;
};

export function checkCarCapacity(carCapacity, appsCapacity) {
    let errorsFields = [];
    if (carCapacity < appsCapacity) {
        errorsFields.push("capacity");
    }
    return errorsFields;
}

export function checkIfRouteExists(apps) {
    let errorsFields = [];
    if (apps.length === 0) {
        errorsFields.push("route");
    }
    return errorsFields;

}




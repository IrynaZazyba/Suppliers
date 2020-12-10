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

    if (!addedApps.length) {
        errorsFields.push("apps");
    }

    if (!waypoints.length) {
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
    if (!apps.length) {
        errorsFields.push("route");
    }
    return errorsFields;
}

export function checkIfRouteCalculated(waypoints) {
    let errorsFields = [];
    if (!waypoints.length) {
        errorsFields.push("introduce-route");
    }
    return errorsFields;
}

export function validateSourceLocation(source) {
    let errorsFields = [];
    if (!source.length) {
        errorsFields.push("source");
    }
    return errorsFields;
}

export function validateCar(car) {
    let errorsFields = [];
    if (!car.length) {
        errorsFields.push("car");
    }
    return errorsFields;
}

export function validateDriver(driver) {
    let errorsFields = [];
    if (!driver.length) {
        errorsFields.push("driver");
    }
    return errorsFields;
}


export function validateUpdatedWaybill(waybill) {
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

    if (!waybill.applications.length) {
        errorsFields.push("apps");
    }

    let notDeleted = JSON.parse(JSON.stringify(waybill.applications)).filter(app => !app.deleteFromWaybill);
    if (!notDeleted.length) {
        errorsFields.push("apps");
    }


    if (!waybill.route.wayPoints.length) {
        errorsFields.push("introduce-route");
    }

    return errorsFields;
};

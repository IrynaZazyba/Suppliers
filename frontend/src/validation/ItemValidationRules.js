export default function validateItem(currentItem, items) {
    let errorsFields = [];
    if (!currentItem.upc) {
        errorsFields.push("upc");
    }

    if (!currentItem.amount || currentItem.amount < 0) {
        errorsFields.push("amount");
    }

    if (!currentItem.cost || currentItem.cost < 0) {
        errorsFields.push("cost");
    }

    items.forEach(i => {
        if (i.id === currentItem.id) {
            errorsFields.push("exist")
        }
    });

    return errorsFields;
};

export function validateShipmentItem(currentItem, items, app) {
    let errorsFields = [];
    if (!currentItem.upc) {
        errorsFields.push("upc");
    }

    if (!currentItem.amount || currentItem.amount < 0) {
        errorsFields.push("amount");
    }

    if (!app.sourceId) {
        errorsFields.push("sourceId");
    }

    if (!app.destinationId) {
        errorsFields.push("destinationId");
    }

    let item = items.filter(i => i.id === currentItem.id);
    if (item.length > 0) {
        errorsFields.push("exist");
    }

    return errorsFields;
}

export function validateEditItem(currentItem, itemsInApp) {

    let errorsFields = [];
    if (!currentItem.upc) {
        errorsFields.push("upc");
    }

    if (!currentItem.amount || currentItem.amount < 0) {
        errorsFields.push("amount");
    }

    if (!currentItem.cost) {
        errorsFields.push("cost");
    }

    itemsInApp.forEach(i => {
        if (i.itemDto.id === currentItem.id) {
            errorsFields.push("exist")
        }
    });
    return errorsFields;
}

export function validateShipmentEditItem(currentItem, itemsInApp) {

    let errorsFields = [];
    if (!currentItem.upc) {
        errorsFields.push("upc");
    }

    if (!currentItem.amount || currentItem.amount < 0) {
        errorsFields.push("amount");
    }

    let item = itemsInApp.filter(i => i.itemDto.id === currentItem.id);
    if (item.length > 0) {
        errorsFields.push("exist");
    }

    return errorsFields;
}






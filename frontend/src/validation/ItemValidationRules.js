export default function validateItem(currentItem, items) {
    let errorsFields = [];
    if (!currentItem.upc) {
        errorsFields.push("upc");
    }

    if (!currentItem.amount) {
        errorsFields.push("amount");
    }

    if (!currentItem.cost) {
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

    if (!currentItem.amount) {
        errorsFields.push("amount");
    }

    if (!app.sourceId) {
        errorsFields.push("sourceId");
    }

    if (!app.destinationId) {
        errorsFields.push("destinationId");
    }

    items.forEach(i => {
        if (i.id === currentItem.id) {
            errorsFields.push("exist")
        }
    });

    return errorsFields;
}

export function validateEditItem(currentItem, itemsInApp) {

    let errorsFields = [];
    if (!currentItem.upc) {
        errorsFields.push("upc");
    }

    if (!currentItem.amount) {
        console.log("amount error")
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




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

    let item = items.filter(i => i.id === currentItem.id);
    if (item.length > 0) {
        errorsFields.push("exist");
    }

    return errorsFields;
};

export function validateWriteOffItem(currentItem, items, app) {
    let errorsFields = [];
    if (!currentItem.upc) {
        errorsFields.push("upc");
    }

    if (!currentItem.amount) {
        errorsFields.push("amount");
    }

    let item = items.filter(i => i.id === currentItem.id);
    if (item.length > 0) {
        errorsFields.push("exist");
    }

    return errorsFields;
};



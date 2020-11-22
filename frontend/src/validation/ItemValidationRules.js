export default function validateItem(item, items) {
    let errorsFields = [];
    if (!item.upc) {
        errorsFields.push("upc");
    }

    if (!item.amount) {
        errorsFields.push("amount");
    }

    if (!item.cost) {
        errorsFields.push("cost");
    }

    items.forEach(i => {
        if (i.id === item.id) {
            errorsFields.push("exist")
        }
    });

    return errorsFields;
};



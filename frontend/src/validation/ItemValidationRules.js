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

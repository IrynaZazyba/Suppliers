export default function validateItem(item) {
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

    return errorsFields;
};



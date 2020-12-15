export default function validateWriteOffAct(act, items) {
    let errorsFields = [];

   console.log(!act.identifier);
    console.log(act);

    if (!act.identifier) {
        errorsFields.push("act-identifier");
    }

    if (!act.totalAmount) {
        errorsFields.push("totalAmount");
    }

    if (items.length === 0) {
        errorsFields.push("items");
    }

    return errorsFields;
};

export function validateWriteOffActItem(currentItem, items) {
    let errorsFields = [];
    if (!currentItem.upc) {
        errorsFields.push("upc");
    }

    if (!currentItem.amount || currentItem.amount < 0) {
        errorsFields.push("amount");
    }

    if (!currentItem.reason) {
        errorsFields.push("reason");
    }

    let item = items.filter(i => i.id === currentItem.id);
    if (item.length > 0) {
        errorsFields.push("exist");
    }

    return errorsFields;
}




export default function validateWriteOffAct(act, items) {
    let errorsFields = [];

    if (!act.identifier) {
        errorsFields.push("identifier");
    }

    if (!act.total_sum) {
        errorsFields.push("total_sum");
    }

    if (!act.total_amount) {
        errorsFields.push("total_amount");
    }

    if (!act.reason_id) {
        errorsFields.push("reason");
    }

    if (items.length === 0) {
        errorsFields.push("items");
    }

    return errorsFields;
};



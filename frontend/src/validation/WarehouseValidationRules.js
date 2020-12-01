export default function validateWarehouseInWriteOffAct(warehouse, items) {
    let errorsFields = [];

    if (!warehouse.identifier) {
        errorsFields.push("identifier");
    }

    if (!warehouse.type) {
        errorsFields.push("type");
    }

    if (items.length === 0) {
        errorsFields.push("items");
    }

    return errorsFields;
};



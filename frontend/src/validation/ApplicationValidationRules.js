export default function validateApplication(app, items) {
    let errorsFields = [];

    if (!app.number) {
        errorsFields.push("number");
    }

    if (!app.sourceId) {
        errorsFields.push("sourceId");
    }

    if (!app.destinationId) {
        errorsFields.push("destinationId");
    }

    if (items.length === 0) {
        errorsFields.push("items");
    }

    return errorsFields;
};



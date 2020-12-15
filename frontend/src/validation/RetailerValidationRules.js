export default function validateRetailer(retailer) {
    let errorsFields = [];
console.log(retailer);
    if (!retailer.fullName) {
        errorsFields.push("fullName");
    }

    if (!retailer.identifier) {
        errorsFields.push("identifier");
    }
    return errorsFields;
};

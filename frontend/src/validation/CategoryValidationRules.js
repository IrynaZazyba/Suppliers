export default function validateItem(dto) {
    return [...validateCategoryName(dto), ...validateTaxRate(dto)];
}

export function validateCategoryName(dto) {
    let errorsFields = [];

    if (dto.category.length < 2 || dto.category.length > 45 || /[*?=%:]/.test(dto.category)) {
        errorsFields.push("category");
    }
    return errorsFields;
}

export function validateTaxRate(dto) {
    let errorFields = [];

    if (!(/[0-9]/.test(dto.taxRate))) {
        errorFields.push("taxRate");
    }
    return errorFields;
}

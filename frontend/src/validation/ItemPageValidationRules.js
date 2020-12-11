import validateCategory from "./CategoryValidationRules";

export default function validateItemPage(dto) {
    return [...validateItemUnits(dto), ...validateItemLabel(dto),
        ...validateUpc(dto), ...validateItemCategory(dto.categoryDto)];
}

export function validateItemLabel(dto) {
    let errorsFields = [];

    if (dto.label.length < 2 || dto.label.length > 45 || /[*?=%:]/.test(dto.label)) {
        errorsFields.push("label");
    }
    return errorsFields;
}

export function validateItemUnits(dto) {
    let errorFields = [];

    if (dto.units < 0 || !(/[0-9]/.test(dto.upc))) {
        errorFields.push("units");
    }
    return errorFields;
}

export function validateUpc(dto) {
    let errorFields = [];

    if (!dto||!(/[0-9]/.test(dto.upc))) {
        errorFields.push("upc");
    }
    return errorFields;
}

export function validateItemCategory(dto) {
    let errorFields = [];

    if (!dto||validateCategory(dto).length !== 0) {
        errorFields.push("category");
    }

    return errorFields;
}


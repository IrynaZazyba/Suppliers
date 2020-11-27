import validateCategory from "./CategoryValidationRules";

export default function validateWarehouse(dto) {
        return [...validateIdentifier(dto), ...validateCity(dto),
            ...validateAddressLine1(dto), ...validateAddressLine2(dto),
            ...validateTotalCapacity(dto)];
}

export function validateIdentifier(dto) {
    let errorsFields = [];

    if (dto.identifier.length < 1 || dto.identifier.length > 50) {
        errorsFields.push("identifier");
    }
    return errorsFields;
}

export function validateCity(dto) {
    let errorsFields = [];

    if (dto.addressDto.city.length < 1 || dto.addressDto.city.length > 50) {
        errorsFields.push("city");
    }
    return errorsFields;
}

export function validateAddressLine1(dto) {
    let errorsFields = [];

    if (dto.addressDto.addressLine1.length < 1 || dto.addressDto.addressLine1.length > 50) {
        errorsFields.push("addressLine1");
    }
    return errorsFields;
}

export function validateAddressLine2(dto) {
    let errorsFields = [];

    if (dto.addressDto.addressLine2.length < 1 || dto.addressDto.addressLine2.length > 50) {
        errorsFields.push("addressLine2");
    }
    return errorsFields;
}

export function validateTotalCapacity(dto) {
    let errorsFields = [];

    if (dto.totalCapacity.length < 1 || dto.totalCapacity.length > 50 || !(/[0-9]/.test(dto.totalCapacity))) {
        errorsFields.push("totalCapacity");
    }
    return errorsFields;
}

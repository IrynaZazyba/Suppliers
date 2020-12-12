export default function validateWarehouse(dto, dropdownMenuName, dispatchersId) {
    return [
        ...validateIdentifier(dto), ...validateCity(dto),
        ...validateAddressLine1(dto), ...validateAddressLine2(dto),
       ...validateState(dto),
        ...validateUsername(dto, dispatchersId), ...validateType(dropdownMenuName)];
}


export function validateWarehouseWithIdentifierExist(dto, dropdownMenuName, dispatchersId, isIdentifierExist) {
    return [
        ...validateIdentifier(dto), ...validateIdentifierExist(isIdentifierExist),
        ...validateCity(dto), ...validateAddressLine1(dto), ...validateAddressLine2(dto),
        ...validateTotalCapacity(dto), ...validateState(dto),
        ...validateUsername(dto, dispatchersId), ...validateType(dropdownMenuName)];
}

export function validateEditWarehouse(dto, dispatchersId) {
    return [
        ...validateCity(dto), ...validateAddressLine1(dto), ...validateAddressLine2(dto),
        ...validateTotalCapacity(dto), ...validateState(dto), ...validateUsername(dto, dispatchersId)];
}

export function validateIdentifier(dto) {
    let errorsFields = [];
    if (dto.identifier.length < 1 || dto.identifier.length > 50) {
        errorsFields.push("identifier");
    }
    return errorsFields;
}

export function validateIdentifierExist(isIdentifierExist) {
    let errorsFields = [];
    if (isIdentifierExist) {
        errorsFields.push("identifier");
    }
    return errorsFields;
}

export function validateCity(dto) {
    let errorsFields = [];
    if (!dto.addressDto.city ||
        dto.addressDto.city.length < 1 || dto.addressDto.city.length > 50) {
        errorsFields.push("city");
    }
    return errorsFields;
}

export function validateAddressLine1(dto) {
    let errorsFields = [];
    if (!dto.addressDto.addressLine1 ||
        (dto.addressDto.addressLine1.length < 1 || dto.addressDto.addressLine1.length > 50)) {
        errorsFields.push("addressLine1");
    }
    return errorsFields;
}

export function validateAddressLine2(dto) {
    let errorsFields = [];

    if (!dto.addressDto.addressLine2 ||
        (dto.addressDto.addressLine2.length < 1 || dto.addressDto.addressLine2.length > 50)) {
        errorsFields.push("addressLine2");
    }
    return errorsFields;
}

export function validateTotalCapacity(dto) {
    let errorsFields = [];

    if (!dto.totalCapacity ||
        (dto.totalCapacity.length < 1 || dto.totalCapacity.length > 50)) {
        errorsFields.push("totalCapacity");
    }
    return errorsFields;
}

export function validateState(dto) {
    let errorsFields = [];
    if (!dto.addressDto.state) {
        errorsFields.push("state");
    }
    return errorsFields;
}

export function validateUsername(dto, dispatchersId) {
    let errorsFields = [];
    if (dto.type === "WAREHOUSE" && dispatchersId.length === 0) {
        errorsFields.push("username");
    }
    return errorsFields;
}

export function validateType(dropdownMenuName) {
    let errorsFields = [];
    if (dropdownMenuName === "select type") {
        errorsFields.push("type");
    }
    return errorsFields;
}

export default function validateWarehouse(dto, dispatchersId, dropdownMenuName) {
        return [...validateIdentifier(dto), ...validateCity(dto),
            ...validateAddressLine1(dto), ...validateAddressLine2(dto),
            ...validateTotalCapacity(dto), ...validateState(dto),
            ...validateUsername(dispatchersId), ...validateType(dropdownMenuName)];
}

export function validateIdentifier(dto) {
    let errorsFields = [];
    if (!dto.addressDto.city ||
        (dto.identifier.length < 1 || dto.identifier.length > 50)) {
        errorsFields.push("identifier");
    } else {
        const index = errorsFields.indexOf("identifier");
        errorsFields.splice(index, 1);
    }
    return errorsFields;
}

export function validateCity(dto) {
    let errorsFields = [];
    if (!dto.addressDto.city ||
        (dto.addressDto.city.length < 1 || dto.addressDto.city.length > 50)) {
        errorsFields.push("city");
    } else {
        const index = errorsFields.indexOf("city");
        errorsFields.splice(index, 1);
    }
    return errorsFields;
}

export function validateAddressLine1(dto) {
    let errorsFields = [];
    if (!dto.addressDto.addressLine1 ||
        (dto.addressDto.addressLine1.length < 1 || dto.addressDto.addressLine1.length > 50)) {
        errorsFields.push("addressLine1");
    } else {
        const index = errorsFields.indexOf("addressLine1");
        errorsFields.splice(index, 1);
    }
    return errorsFields;
}

export function validateAddressLine2(dto) {
    let errorsFields = [];

    if (!dto.addressDto.addressLine2 ||
        (dto.addressDto.addressLine2.length < 1 || dto.addressDto.addressLine2.length > 50)) {
        errorsFields.push("addressLine2");
    } else {
        const index = errorsFields.indexOf("addressLine2");
        errorsFields.splice(index, 1);
    }
    return errorsFields;
}

export function validateTotalCapacity(dto) {
    let errorsFields = [];

    if (!dto.addressDto.city ||
        (dto.totalCapacity.length < 1 || dto.totalCapacity.length > 50)) {
        errorsFields.push("totalCapacity");
    } else {
        const index = errorsFields.indexOf("totalCapacity");
        errorsFields.splice(index, 1);
    }
    return errorsFields;
}

export function validateState(dto) {
    let errorsFields = [];
    if (!dto.addressDto.state.state) {
        errorsFields.push("state");
    } else {
        const index = errorsFields.indexOf("state");
        errorsFields.splice(index, 1);
    }
    return errorsFields;
}

export function validateUsername(dispatchersId) {
    let errorsFields = [];
    if (dispatchersId.length === 0) {
        errorsFields.push("username");
    } else {
        const index = errorsFields.indexOf("username");
        errorsFields.splice(index, 1);
    }
    return errorsFields;
}

export function validateType(dropdownMenuName) {
    let errorsFields = [];
    if (dropdownMenuName === "select type") {
        errorsFields.push("type");
    } else {
        const index = errorsFields.indexOf("type");
        errorsFields.splice(index, 1);
    }
    return errorsFields;
}

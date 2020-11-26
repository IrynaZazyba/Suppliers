import isEmail from 'validator/lib/isEmail';

export default function validateUser(dto) {
    let errorsFields = [];

    if (dto.adminEmail.length < 5 || dto.adminEmail.length > 254 || !isEmail(dto.adminEmail)) {
        errorsFields.push("email");
    }

    let validationResult = validateUserName(dto);
    errorsFields = [...errorsFields, ...validationResult];
    return errorsFields;
};

export function validateUserName(dto) {
    let errorsFields = [];

    if (dto.name.length < 2 || dto.name.length > 50 || /[*?=%:]/.test(dto.name)) {
        errorsFields.push("name");
    }
    return errorsFields;
}



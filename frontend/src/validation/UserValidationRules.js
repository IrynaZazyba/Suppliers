import isEmail from 'validator/lib/isEmail';

export default function validateUser(dto) {
    let errorsFields = [];

    if (dto.email.length < 5 || dto.email.length > 254 || !isEmail(dto.email)) {
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



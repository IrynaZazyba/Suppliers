import isEmail from 'validator/lib/isEmail';

export default function validateCustomer(dto) {
    let errorsFields = [];

    if (dto.adminEmail.length < 5 || dto.adminEmail.length > 254 || !isEmail(dto.adminEmail)) {
        errorsFields.push("email");
    }

    if (dto.name.length < 2 || dto.name.length > 50 || /[*?=%:]/.test(dto.name)) {
        errorsFields.push("name");
    }
    return errorsFields;
};


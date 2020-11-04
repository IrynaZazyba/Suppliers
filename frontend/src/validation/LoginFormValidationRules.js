import isEmail from 'validator/lib/isEmail';

export default function validateLoginForm(data) {
    let errorsFields = [];

    if (data.username.length < 5 || data.username.length > 254||!isEmail(data.username)) {
        errorsFields.push("username");
    }

    if (data.password.length < 4 || data.password.length > 50) {
        errorsFields.push("password");
    }
    return errorsFields;
};


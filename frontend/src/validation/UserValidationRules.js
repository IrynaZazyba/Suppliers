import isEmail from 'validator/lib/isEmail';
import {useState} from "react";

export default function validateUser(user, addressDto) {
    let errorsFields = [];

    if (!user.name) {
        errorsFields.push("name");
    }

    if (!user.surname) {
        errorsFields.push("surname");
    }
    if (!user.birthday) {
        errorsFields.push("birthday");
    }

    if (!user.role) {
        errorsFields.push("role");
    }

    if (!user.email || !isEmail(user.email)) {
        errorsFields.push("email");
    }

    if (!user.addressDto || !addressDto.city) {
        errorsFields.push("city");
    }
    if (!user.addressDto || !addressDto.addressLine1) {
        errorsFields.push("addressLine1");
    }
    if (!user.addressDto || !addressDto.addressLine2) {
        errorsFields.push("addressLine2");
    }
    if (!user.addressDto || !addressDto.state.state) {
        errorsFields.push("state");
    }

    return errorsFields;
};

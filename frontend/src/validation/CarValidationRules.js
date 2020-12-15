export default function validateCar(car) {
    let errorsFields = [];

    if (!car.number) {
        errorsFields.push("number");
    }

    if (!car.totalCapacity) {
        errorsFields.push("totalCapacity");
    }

    if (!car.currentCapacity) {
        errorsFields.push("currentCapacity");
    }

    if (!car.addressDto || !car.addressDto.city) {
        errorsFields.push("city");
    }
    if (!car.addressDto || !car.addressDto.addressLine1) {
        errorsFields.push("addressLine1");
    }
    if (!car.addressDto || !car.addressDto.addressLine2) {
        errorsFields.push("addressLine2");
    }
    if (!car.addressDto || !car.addressDto.state.state) {
        errorsFields.push("state");
    }
    return errorsFields;
};

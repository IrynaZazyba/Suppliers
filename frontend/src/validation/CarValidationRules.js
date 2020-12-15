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

    if (!car.addressDto.state.state) {
        errorsFields.push("state");
    }

    return errorsFields;
};

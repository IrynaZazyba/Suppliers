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


    return errorsFields;
};

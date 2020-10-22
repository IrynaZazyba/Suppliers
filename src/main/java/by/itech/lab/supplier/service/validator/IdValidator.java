package by.itech.lab.supplier.service.validator;

public final class IdValidator {
    private IdValidator() {
    }

    public static void validate(Long id) {
        if (id < 0) {
            throw new RuntimeException("Incorrect id (should be positive)");
        }
        if (id == 0) {
            throw new RuntimeException("object is not exist");
        }
    }
}

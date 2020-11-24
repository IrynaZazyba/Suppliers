package by.itech.lab.supplier.exception;

public class ConflictWithTheCurrentWarehouseStateException extends RuntimeException {

    private static final long serialVersionUID = 3743903100951638522L;

    public ConflictWithTheCurrentWarehouseStateException(String message) {
        super(message);
    }
}

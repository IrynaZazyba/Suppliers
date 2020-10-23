package by.itech.lab.supplier.exception;

public class NotFoundInDBException extends RuntimeException {
    public NotFoundInDBException() {
    }

    public NotFoundInDBException(String message, Throwable cause) {
        super(message, cause);
    }

    public NotFoundInDBException(String message) {
        super(message);
    }

    public NotFoundInDBException(Throwable cause) {
        super(cause);
    }
}

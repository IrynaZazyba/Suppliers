package by.itech.lab.supplier.exception;

public class NotUniqueException extends Exception {
    public NotUniqueException() {}

    public NotUniqueException(String message, Throwable cause) {
        super(message, cause);
    }

    public NotUniqueException(String message) {
        super(message);
    }

    public NotUniqueException(Throwable cause) {
        super(cause);
    }
}

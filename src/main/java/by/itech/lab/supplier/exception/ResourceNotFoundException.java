package by.itech.lab.supplier.exception;


public class ResourceNotFoundException extends RuntimeException {

    private static final long serialVersionUID = 7253782027516058555L;

    public ResourceNotFoundException() {
    }

    public ResourceNotFoundException(String message) {
        super(message);
    }

    public ResourceNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }

    public ResourceNotFoundException(Throwable cause) {
        super(cause);
    }

}


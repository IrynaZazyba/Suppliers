package by.itech.lab.supplier.exception;


public class ResourceNotFoundException extends RuntimeException {

    private static final long serialVersionUID = 2576247733364350078L;

    public ResourceNotFoundException(String message) {
        super(message);
    }

}



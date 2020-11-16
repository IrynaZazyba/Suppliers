package by.itech.lab.supplier.exception;

public class ConflictWithTheCurrentStateException extends RuntimeException{


    private static final long serialVersionUID = 3743903100951638522L;

    public ConflictWithTheCurrentStateException(String message) {
        super(message);
    }
}
